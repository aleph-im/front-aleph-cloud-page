import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  NameAndTagsField,
  defaultNameAndTags,
} from '@/hooks/form/useAddNameAndTags'
import {
  SSHKeyField,
  // defaultValues as sshKeyDefaultValues,
} from '@/hooks/form/useAddSSHKeys'
import { PersistentVolumeField, VolumeField } from '@/hooks/form/useAddVolume'
import {
  InstanceImageField,
  defaultInstanceImage,
} from '@/hooks/form/useSelectInstanceImage'
import {
  InstanceSpecsField,
  getDefaultSpecsOptions,
  validateMinNodeSpecs,
} from '@/hooks/form/useSelectInstanceSpecs'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { DomainField } from '@/hooks/form/useAddDomains'
import { InstanceManager } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EntityType,
  PaymentMethod,
  VolumeType,
  superToken,
} from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { useRequestCRNs } from '@/hooks/common/useRequestEntity/useRequestCRNs'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { CRN, CRNSpecs, NodeLastVersions } from '@/domain/node'
import { Framework } from '@superfluid-finance/sdk-core'
import { Web3Provider } from '@ethersproject/providers'
import {
  StreamDurationField,
  defaultStreamDuration,
} from '@/hooks/form/useSelectStreamDuration'

export type NewInstanceStreamFormState = NameAndTagsField & {
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

export const defaultValues: Partial<NewInstanceStreamFormState> = {
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

export type UseNewInstanceStreamPage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewInstanceStreamFormState>
  node?: CRN
  lastVersion?: NodeLastVersions
  nodeSpecs?: CRNSpecs
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewInstanceStreamPage(): UseNewInstanceStreamPage {
  useConnectedWard()

  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, accountBalance } = appState

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
    async (state: NewInstanceStreamFormState) => {
      if (!manager) throw new Error('Manager not ready')

      console.log(state)

      if (!account) throw new Error('Invalid account')
      if (!node) throw new Error('Invalid node')
      if (!state?.streamCost) throw new Error('Invalid stream cost')

      const web3Provider = new Web3Provider(window?.ethereum)

      const sf = await Framework.create({
        chainId: 43113,
        provider: web3Provider,
      })

      const signer = sf.createSigner({ web3Provider })

      const flowRate = String(
        Math.round((state.streamCost * 10 ** 18) / (60 * 60)),
      )

      const paymentData = {
        superToken,
        flowRate,
        sender: account.address,
        receiver: node.reward,
      }

      console.log(paymentData)

      const flow = sf.cfaV1.createFlow(paymentData)
      const txnResponse = await flow.exec(signer)

      console.log(txnResponse)

      const txnReceipt = await txnResponse.wait()

      console.log(txnReceipt)

      return

      // const accountInstance = await manager.add(state)

      // dispatch({
      //   type: ActionTypes.addAccountInstance,
      //   payload: { accountInstance },
      // })

      // @todo: Check new volumes and domains being created to add them to the store

      // router.replace('/dashboard')
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
  const values = useWatch({ control }) as NewInstanceStreamFormState

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
