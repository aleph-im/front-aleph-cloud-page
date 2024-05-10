import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Blockchain } from '@aleph-sdk/core'
import { SuperfluidAccount } from '@aleph-sdk/superfluid'
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
import { useConnect } from '@/hooks/common/useConnect'
import { ActionTypes } from '@/helpers/store'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import Err from '@/helpers/errors'

export type NewInstanceCRNFormState = NameAndTagsField & {
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

export const defaultValues: Partial<NewInstanceCRNFormState> = {
  ...defaultNameAndTags,
  image: defaultInstanceImage,
  specs,
  systemVolumeSize: specs.storage,
  paymentMethod: PaymentMethod.Stream,
  streamDuration: defaultStreamDuration,
  streamCost: Number.POSITIVE_INFINITY,
  // sshKeys: [{ ...sshKeyDefaultValues }],
}

export type UseNewInstanceCRNPage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewInstanceCRNFormState>
  node?: CRN
  lastVersion?: NodeLastVersions
  nodeSpecs?: CRNSpecs
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewInstanceCRNPage(): UseNewInstanceCRNPage {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { accountBalance } = appState
  const { account, switchNetwork, selectedNetwork } = useConnect()

  // -------------------------

  const { hash } = router.query

  const { nodes, lastVersion } = useRequestCRNs({})

  const node = useMemo(() => {
    if (!nodes) return
    return nodes.find((node) => node.hash === hash)
  }, [nodes, hash])

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
    async (state: NewInstanceCRNFormState) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount
      if (!node || !node.stream_reward) throw Err.InvalidNode
      if (!state?.streamCost) throw Err.InvalidStreamCost
      if (window?.ethereum === undefined) throw Err.NoWalletDetected

      let superfluidAccount
      if (selectedNetwork !== Blockchain.AVAX) {
        const account = await switchNetwork(Blockchain.AVAX)
        superfluidAccount = account as SuperfluidAccount
      } else {
        superfluidAccount = account as SuperfluidAccount
      }

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
        dispatch({
          type: ActionTypes.addAccountInstance,
          payload: { accountInstance },
        })

        await router.replace('/')
      } finally {
        await stop()
      }
    },
    [
      account,
      dispatch,
      manager,
      next,
      node,
      router,
      selectedNetwork,
      stop,
      switchNetwork,
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
  const values = useWatch({ control }) as NewInstanceCRNFormState

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
    (accountBalance || 0) > (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  // -------------------------

  return {
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    node,
    lastVersion,
    nodeSpecs,
    handleSubmit,
  }
}
