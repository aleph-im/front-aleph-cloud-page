import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import { EntityType, PaymentMethod, VolumeType } from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'

export type NewInstanceHoldFormState = NameAndTagsField & {
  image: InstanceImageField
  specs: InstanceSpecsField
  sshKeys: SSHKeyField[]
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  domains?: DomainField[]
  paymentMethod: PaymentMethod
}

const specs = { ...getDefaultSpecsOptions(true)[0] }

export const defaultValues: Partial<NewInstanceHoldFormState> = {
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
  paymentMethod: PaymentMethod.Hold,
  // sshKeys: [{ ...sshKeyDefaultValues }],
}

export type UseNewInstanceAutoPage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewInstanceHoldFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewInstanceAutoPage(): UseNewInstanceAutoPage {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, accountBalance } = appState

  const manager = useInstanceManager()

  const onSubmit = useCallback(
    async (state: NewInstanceHoldFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const accountInstance = await manager.add(state)

      dispatch({
        type: ActionTypes.addAccountInstance,
        payload: { accountInstance },
      })

      // @todo: Check new volumes and domains being created to add them to the store

      await router.replace('/')
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
  const values = useWatch({ control }) as NewInstanceHoldFormState

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
    },
  })

  const canAfford =
    (accountBalance || 0) > (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  return {
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    handleSubmit,
  }
}
