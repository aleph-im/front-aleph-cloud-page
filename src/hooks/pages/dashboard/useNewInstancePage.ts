import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { EnvVarProp } from '@/hooks/form/useAddEnvVars'
import { NameAndTagsProp } from '@/hooks/form/useAddNameAndTags'
import { SSHKeyProp } from '@/hooks/form/useAddSSHKeys'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import {
  InstanceImageProp,
  defaultInstanceImageOptions,
} from '@/hooks/form/useSelectInstanceImage'
import {
  InstanceSpecsProp,
  getDefaultSpecsOptions,
} from '@/hooks/form/useSelectInstanceSpecs'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { ActionTypes } from '@/helpers/store'
import { DomainProp } from '@/hooks/form/useAddDomains'
import { InstanceManager } from '@/domain/instance'
import { UseControllerReturn, useController } from 'react-hook-form'

export type NewInstanceFormState = {
  nameAndTags?: NameAndTagsProp
  image?: InstanceImageProp
  specs?: InstanceSpecsProp
  volumes?: VolumeProp[]
  envVars?: EnvVarProp[]
  sshKeys?: SSHKeyProp[]
  domains?: DomainProp[]
}

export const defaultValues: Partial<NewInstanceFormState> = {
  image: defaultInstanceImageOptions[0],
  specs: getDefaultSpecsOptions(true)[0],
  // volumes: [{ ...defaultVolume }],
}

export type UseNewInstancePage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  imageCtrl: UseControllerReturn<NewInstanceFormState, 'image'>
  specsCtrl: UseControllerReturn<NewInstanceFormState, 'specs'>
  volumesCtrl: UseControllerReturn<NewInstanceFormState, 'volumes'>
  envVarsCtrl: UseControllerReturn<NewInstanceFormState, 'envVars'>
  sshKeysCtrl: UseControllerReturn<NewInstanceFormState, 'sshKeys'>
  domainsCtrl: UseControllerReturn<NewInstanceFormState, 'domains'>
  nameAndTagsCtrl: UseControllerReturn<NewInstanceFormState, 'nameAndTags'>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeEntityTab: (tabId: string) => void
  values: any
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

  const { watch, control, handleSubmit } = useForm({ defaultValues, onSubmit })
  const values = watch()

  const imageCtrl = useController({
    control,
    name: 'image',
    rules: { required: true },
  })

  const specsCtrl = useController({
    control,
    name: 'specs',
    rules: { required: true },
  })

  const volumesCtrl = useController({
    control,
    name: 'volumes',
    rules: { required: false },
  })

  const envVarsCtrl = useController({
    control,
    name: 'envVars',
    rules: { required: false },
  })

  const sshKeysCtrl = useController({
    control,
    name: 'sshKeys',
    rules: { required: false },
  })

  const domainsCtrl = useController({
    control,
    name: 'domains',
    rules: { required: false },
  })

  const nameAndTagsCtrl = useController({
    control,
    name: 'nameAndTags',
    rules: { required: true },
  })

  const { totalCost } = useMemo(
    () =>
      InstanceManager.getCost({
        specs: specsCtrl.field.value,
        volumes: volumesCtrl.field.value,
        capabilities: {},
      }),
    [specsCtrl.field.value, volumesCtrl.field.value],
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
    imageCtrl,
    specsCtrl,
    volumesCtrl,
    envVarsCtrl,
    sshKeysCtrl,
    domainsCtrl,
    nameAndTagsCtrl,
    handleSubmit,
    handleChangeEntityTab,
    values,
  }
}
