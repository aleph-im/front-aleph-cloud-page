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
} from '@/hooks/form/useSelectInstanceSpecs'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { ActionTypes } from '@/helpers/store'
import { DomainField } from '@/hooks/form/useAddDomains'
import { InstanceManager } from '@/domain/instance'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VolumeType } from '@/helpers/constants'

export type NewInstanceFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  domains?: DomainField[]
}

const specs = { ...getDefaultSpecsOptions(true)[0] }

export const defaultValues: Partial<NewInstanceFormState> = {
  ...defaultNameAndTags,
  image: defaultInstanceImage,
  specs,
  volumes: [
    {
      volumeType: VolumeType.Persistent,
      name: 'System',
      mountPath: '/',
      size: specs.storage,
      isFake: true,
    },
  ],
  // sshKeys: [{ ...sshKeyDefaultValues }],
}

export type UseNewInstancePage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewInstanceFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeEntityTab: (tabId: string) => void
}

export function useNewInstancePage(): UseNewInstancePage {
  useConnectedWard()

  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, accountBalance } = appState

  const manager = useInstanceManager()

  const onSubmit = useCallback(
    async (state: NewInstanceFormState) => {
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
    resolver: zodResolver(InstanceManager.addSchema),
  })
  const values = useWatch({ control }) as NewInstanceFormState

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

  const { totalCost } = useMemo(
    () =>
      InstanceManager.getCost({
        specs: values.specs,
        volumes: values.volumes,
        capabilities: {},
      }),
    [values.specs, values.volumes],
  )

  const canAfford = (accountBalance || 0) > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  const handleChangeEntityTab = useCallback(
    (id: string) => {
      router.push(`/dashboard/${id}`)
    },
    [router],
  )

  return {
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    handleSubmit,
    handleChangeEntityTab,
  }
}
