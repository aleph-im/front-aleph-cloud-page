import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { InstanceManager } from '@/domain/instance'
import { getTotalProductCost } from '@/helpers/utils'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { EnvVarProp } from '@/hooks/form/useAddEnvVars'
import { NameAndTagsProp } from '@/hooks/form/useAddNameAndTags'
import { SSHKeyProp } from '@/hooks/form/useAddSSHKeys'
import { VolumeProp, defaultVolume } from '@/hooks/form/useAddVolume'
import {
  InstanceImageProp,
  defaultInstanceImageOptions,
} from '@/hooks/form/useSelectInstanceImage'
import {
  InstanceSpecsProp,
  defaultSpecsOptions,
} from '@/hooks/form/useSelectInstanceSpecs'

export type NewInstanceFormState = {
  name?: string
  tags?: string[]
  image?: InstanceImageProp
  specs?: InstanceSpecsProp
  volumes?: VolumeProp[]
  envVars?: EnvVarProp[]
  sshKeys?: SSHKeyProp[]
}

export const initialState: NewInstanceFormState = {
  image: defaultInstanceImageOptions[0],
  specs: defaultSpecsOptions[0],
  volumes: [{ ...defaultVolume }],
}

export type UseNewInstancePage = {
  formState: NewInstanceFormState
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeEntityTab: (tabId: string) => void
  handleChangeInstanceImage: (image: InstanceImageProp) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecsProp) => void
  handleChangeVolumes: (volumes: VolumeProp[]) => void
  handleChangeEnvVars: (envVars: EnvVarProp[]) => void
  handleChangeSSHKeys: (sshKeys: SSHKeyProp[]) => void
  handleChangeNameAndTags: (nameAndTags: NameAndTagsProp) => void
}

export function useNewInstancePage(): UseNewInstancePage {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account, accountBalance } = appState

  const onSubmit = useCallback(
    async (state: NewInstanceFormState) => {
      console.log('state', state)

      if (!account) throw new Error('Account not found')

      const instanceManager = new InstanceManager(account)

      const { image, name, tags, envVars, sshKeys, volumes, specs } = state

      await instanceManager.add({
        name,
        tags,
        envVars,
        sshKeys,
        volumes,
        specs,
        image,
      })

      router.replace('/dashboard')
    },
    [account, router],
  )

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeInstanceImage = useCallback(
    (image: InstanceImageProp) => setFormValue('image', image),
    [setFormValue],
  )

  const handleChangeInstanceSpecs = useCallback(
    (specs: InstanceSpecsProp) => setFormValue('specs', specs),
    [setFormValue],
  )

  const handleChangeVolumes = useCallback(
    (volumes: VolumeProp[]) => setFormValue('volumes', volumes),
    [setFormValue],
  )

  const handleChangeEnvVars = useCallback(
    (envVars: EnvVarProp[]) => setFormValue('envVars', envVars),
    [setFormValue],
  )

  const handleChangeSSHKeys = useCallback(
    (sshKeys: SSHKeyProp[]) => setFormValue('sshKeys', sshKeys),
    [setFormValue],
  )

  const handleChangeNameAndTags = useCallback(
    ({ name, tags }: NameAndTagsProp) => {
      setFormValue('name', name)
      setFormValue('tags', tags)
    },
    [setFormValue],
  )

  const { totalCost } = useMemo(
    () =>
      getTotalProductCost({
        cpu: formState.specs?.cpu,
        isPersistentVM: true,
        volumes: formState.volumes,
        capabilities: {},
      }),
    [formState],
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
    formState,
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    handleSubmit,
    handleChangeEntityTab,
    handleChangeInstanceImage,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
    handleChangeEnvVars,
    handleChangeSSHKeys,
    handleChangeNameAndTags,
  }
}
