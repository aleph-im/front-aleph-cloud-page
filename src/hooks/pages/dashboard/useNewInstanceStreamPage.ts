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
import { ActionTypes } from '@/helpers/store'
import { DomainField } from '@/hooks/form/useAddDomains'
import { InstanceManager } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EntityType, PaymentMethod, VolumeType } from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { useRequestCRNs } from '@/hooks/common/useRequestEntity/useRequestCRNs'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { CRN, CRNSpecs, NodeLastVersions } from '@/domain/node'

export type NewInstanceStreamFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  domains?: DomainField[]
  nodeSpecs?: CRNSpecs
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

  const manager = useInstanceManager()

  const onSubmit = useCallback(
    async (state: NewInstanceStreamFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const accountInstance = await manager.add(state)

      dispatch({
        type: ActionTypes.addAccountInstance,
        payload: { accountInstance },
      })

      // @todo: Check new volumes and domains being created to add them to the store

      router.replace('/dashboard')
    },
    [dispatch, manager, router],
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

  const { cost } = useEntityCost({
    entityType: EntityType.Instance,
    props: {
      specs: values.specs,
      volumes: values.volumes,
      paymentMethod: PaymentMethod.Stream,
    },
  })

  const canAfford =
    (accountBalance || 0) > (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

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

  // @note: Set nodeSpecs
  useEffect(() => {
    setValue('nodeSpecs', nodeSpecs)
  }, [nodeSpecs, setValue])

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
