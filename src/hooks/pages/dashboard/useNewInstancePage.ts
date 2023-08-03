import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import { VolumeField } from '@/hooks/form/useAddVolume'
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
import {
  Control,
  UseControllerReturn,
  useController,
  useWatch,
} from 'react-hook-form'

export type NewInstanceFormState = {
  nameAndTags?: NameAndTagsField
  image?: InstanceImageField
  specs?: InstanceSpecsField
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  sshKeys?: SSHKeyField[]
  domains?: DomainField[]
}

export const defaultValues: Partial<NewInstanceFormState> = {
  image: defaultInstanceImage,
  specs: getDefaultSpecsOptions(true)[0],
}

export type UseNewInstancePage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  volumesCtrl: UseControllerReturn<NewInstanceFormState, 'volumes'>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeEntityTab: (tabId: string) => void
  values: any
  control: Control<any>
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

      const { image, nameAndTags, envVars, domains, sshKeys, volumes, specs } =
        state

      const accountInstance = await manager.add({
        ...nameAndTags,
        envVars,
        sshKeys,
        domains,
        volumes,
        specs,
        image,
      })

      dispatch({
        type: ActionTypes.addAccountInstance,
        payload: { accountInstance },
      })

      // @todo: Check new volumes and domains being created to add them to the store

      router.replace('/dashboard')
    },
    [dispatch, manager, router],
  )

  const { control, handleSubmit } = useForm({ defaultValues, onSubmit })
  const values = useWatch({ control }) as NewInstanceFormState

  const volumesCtrl = useController({
    control,
    name: 'volumes',
    rules: {},
  })

  const { totalCost } = useMemo(
    () =>
      InstanceManager.getCost({
        specs: values.specs,
        volumes: volumesCtrl.field.value,
        capabilities: {},
      }),
    [values.specs, volumesCtrl.field.value],
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
    volumesCtrl,
    handleSubmit,
    handleChangeEntityTab,
    values,
    control,
  }
}
