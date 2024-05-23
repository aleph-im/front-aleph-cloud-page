import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Blockchain } from '@aleph-sdk/core'
import { createFromAvalancheAccount } from '@aleph-sdk/superfluid'
import { useForm } from '@/hooks/common/useForm'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  defaultNameAndTags,
  NameAndTagsField,
} from '@/hooks/form/useAddNameAndTags'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import { VolumeField } from '@/hooks/form/useAddVolume'
import {
  defaultInstanceImage,
  InstanceImageField,
} from '@/hooks/form/useSelectInstanceImage'
import {
  getDefaultSpecsOptions,
  InstanceSpecsField,
} from '@/hooks/form/useSelectInstanceSpecs'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddInstance, InstanceManager } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { useRequestCRNs } from '@/hooks/common/useRequestEntity/useRequestCRNs'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { CRN, CRNSpecs, NodeLastVersions } from '@/domain/node'
import {
  defaultStreamDuration,
  StreamDurationField,
} from '@/hooks/form/useSelectStreamDuration'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import { EntityAddAction } from '@/store/entity'
import { useConnection } from '@/hooks/common/useConnection'
import { AvalancheAccount } from '@aleph-sdk/avalanche'

export type NewInstanceFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  domains?: DomainField[]
  systemVolumeSize: number
  nodeSpecs?: CRNSpecs
  paymentMethod: PaymentMethod
  streamDuration: StreamDurationField
  streamCost: number
}

const specs = { ...getDefaultSpecsOptions(true, PaymentMethod.Stream)[0] }

export const defaultValues: Partial<NewInstanceFormState> = {
  ...defaultNameAndTags,
  image: defaultInstanceImage,
  specs,
  systemVolumeSize: specs.storage,
  paymentMethod: PaymentMethod.Hold,
  streamDuration: defaultStreamDuration,
  streamCost: Number.POSITIVE_INFINITY,
  // sshKeys: [{ ...sshKeyDefaultValues }],
}

export type UseNewInstancePage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewInstanceFormState>
  node?: CRN
  lastVersion?: NodeLastVersions
  nodeSpecs?: CRNSpecs
  handleSubmit: (e: FormEvent) => Promise<void>
  handleSelectNode: (hash?: string) => Promise<boolean>
}

export function useNewInstancePage(): UseNewInstancePage {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const {
    blockchain,
    account,
    balance: accountBalance = 0,
  } = appState.connection

  const { handleConnect } = useConnection({
    triggerOnMount: false,
  })

  // -------------------------

  const { crn } = router.query

  const handleSelectNode = useCallback(
    (hash?: string) => {
      const { crn, ...rest } = router.query
      const query = hash ? { ...rest, crn: hash } : rest

      debugger
      if (router.query.crn === query.crn) return

      return router.replace({ query })
    },
    [router],
  )

  const { nodes, lastVersion } = useRequestCRNs({})

  const node = useMemo(() => {
    if (!nodes) return
    return nodes.find((node) => node.hash === crn)
  }, [nodes, crn])

  const userNodes = useMemo(() => {
    if (!node) return
    return [node]
  }, [node])

  const { specs } = useRequestCRNSpecs({ nodes: userNodes })

  const nodeSpecs = useMemo(() => {
    if (!node) return
    if (!specs) return

    return specs[node.hash]?.data
  }, [specs, node])

  // -------------------------

  const minSpecs = useMemo(() => {
    const [min] = getDefaultSpecsOptions(true)
    return min
  }, [])

  const nodeManager = useNodeManager()

  useEffect(() => {
    if (!nodeSpecs) return

    const isValid = nodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)
    if (isValid) return

    router.replace('.')
  }, [nodeManager, minSpecs, nodeSpecs, router])

  // -------------------------

  const manager = useInstanceManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewInstanceFormState) => {
      if (!manager) throw new Error('Manager not ready')
      if (!account) throw new Error('Invalid account')
      if (!node || !node.stream_reward) throw new Error('Invalid node')
      if (!state?.streamCost) throw new Error('Invalid stream cost')
      if (window?.ethereum === undefined) throw new Error('No wallet found')

      if (
        blockchain !== Blockchain.AVAX ||
        !(account instanceof AvalancheAccount)
      ) {
        handleConnect({ blockchain: Blockchain.AVAX })
        throw new Error('Invalid network')
      }

      // @todo: Refactor this
      const superfluidAccount = createFromAvalancheAccount(account)

      const iSteps = await manager.getSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(
        {
          ...state,
          payment: {
            chain: Blockchain.AVAX,
            type: PaymentMethod.Stream,
            sender: account.address,
            receiver: node.stream_reward,
            streamCost: state.streamCost,
            streamDuration: state.streamDuration,
          },
          node,
        } as AddInstance,
        superfluidAccount,
      )

      try {
        let accountInstance

        while (!accountInstance) {
          const { value, done } = await steps.next()

          if (done) {
            accountInstance = value
            break
          }

          await next(nSteps)
        }

        // @todo: Check new volumes and domains being created to add them to the store
        dispatch(
          new EntityAddAction({ name: 'instance', entities: accountInstance }),
        )

        await router.replace('/')
      } finally {
        await stop()
      }
    },
    [
      manager,
      account,
      node,
      blockchain,
      handleConnect,
      dispatch,
      router,
      next,
      stop,
    ],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(InstanceManager.addStreamSchema),
    readyDeps: [],
  })
  const values = useWatch({ control }) as NewInstanceFormState

  const { storage } = values.specs
  const { systemVolumeSize } = values

  // @note: Change default System fake volume size when the specs changes
  useEffect(() => {
    if (!storage) return
    if (systemVolumeSize === storage) return

    setValue('systemVolumeSize', storage)
  }, [storage, setValue, systemVolumeSize])

  // @note: Set nodeSpecs
  useEffect(() => {
    setValue('nodeSpecs', nodeSpecs)
  }, [nodeSpecs, setValue])

  // -------------------------

  const { cost } = useEntityCost({
    entityType: EntityType.Instance,
    props: {
      specs: values.specs,
      volumes: values.volumes,
      paymentMethod: values.paymentMethod,
      streamDuration: values.streamDuration,
    },
  })

  // @note: Set streamCost
  useEffect(() => {
    if (!cost) return
    if (values.streamCost === cost.totalStreamCost) return

    setValue('streamCost', cost.totalStreamCost)
  }, [cost, setValue, values])

  const canAfford =
    accountBalance > (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  // -------------------------

  return {
    address: account?.address || '',
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    node,
    lastVersion,
    nodeSpecs,
    handleSubmit,
    handleSelectNode,
  }
}
