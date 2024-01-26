import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  defaultNameAndTags,
  NameAndTagsField,
} from '@/hooks/form/useAddNameAndTags'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import { PersistentVolumeField, VolumeField } from '@/hooks/form/useAddVolume'
import {
  defaultInstanceImage,
  InstanceImageField,
} from '@/hooks/form/useSelectInstanceImage'
import {
  getDefaultSpecsOptions,
  InstanceSpecsField,
  validateMinNodeSpecs,
} from '@/hooks/form/useSelectInstanceSpecs'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddInstance, InstanceManager } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EntityType, PaymentMethod, VolumeType } from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { useRequestCRNs } from '@/hooks/common/useRequestEntity/useRequestCRNs'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { CRN, CRNSpecs, NodeLastVersions } from '@/domain/node'
import {
  defaultStreamDuration,
  StreamDurationField,
} from '@/hooks/form/useSelectStreamDuration'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { ActionTypes } from '@/helpers/store'
import { useConnect } from '@/hooks/common/useConnect'

export type NewInstanceCRNFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  domains?: DomainField[]
  nodeSpecs?: CRNSpecs
  paymentMethod: PaymentMethod
  streamDuration: StreamDurationField
  streamCost: number
}

const specs = { ...getDefaultSpecsOptions(true)[0] }

export const defaultValues: Partial<NewInstanceCRNFormState> = {
  ...defaultNameAndTags,
  image: defaultInstanceImage,
  specs,
  volumes: [
    {
      volumeType: VolumeType.Persistent,
      name: 'System Volume',
      mountPath: '/',
      size: specs.storage,
      isFake: true,
    },
  ],
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
  const { account, switchNetwork, selectedNetwork } = useConnect();

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

  useEffect(() => {
    if (!nodeSpecs) return

    const isValid = validateMinNodeSpecs(minSpecs, nodeSpecs)
    if (isValid) return

    router.replace('.')
  }, [minSpecs, nodeSpecs, router])

  // -------------------------

  const manager = useInstanceManager()

  const onSubmit = useCallback(
    async (state: NewInstanceCRNFormState) => {
      if (!manager) throw new Error('Manager not ready')
      if (!account) throw new Error('Invalid account')
      if (!node || !node.stream_reward) throw new Error('Invalid node')
      if (!state?.streamCost) throw new Error('Invalid stream cost')
      if (window?.ethereum === undefined) throw new Error('No wallet found')

      let superfluidAccount
      if (selectedNetwork !== Chain.AVAX) {
        superfluidAccount = await switchNetwork(Chain.AVAX)
      } else {
        superfluidAccount = account
      }

      const accountInstance = await manager.add({
        ...state,
        payment: {
          chain: Chain.AVAX,
          type: PaymentMethod.Stream,
          sender: account.address,
          receiver: node.stream_reward,
          streamCost: state.streamCost,
          streamDuration: state.streamDuration,
        },
        node,
      } as AddInstance, superfluidAccount)

      dispatch({
        type: ActionTypes.addAccountInstance,
        payload: { accountInstance },
      })

      // @todo: Check new volumes and domains being created to add them to the store

      await router.replace('/')
    },
    [account, manager, node],
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
  const fakeVolume = values.volumes?.find((volume) => volume.isFake) as
    | PersistentVolumeField
    | undefined

  // @note: Change default System fake volume size when the specs changes
  useEffect(() => {
    if (!storage) return
    if (!fakeVolume) return
    if (fakeVolume.size === storage) return

    setValue('volumes.0.size', storage)
  }, [storage, fakeVolume, setValue])

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