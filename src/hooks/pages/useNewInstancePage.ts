import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback } from 'react'
import useConnectedWard from '../useConnectedWard'
import { useRouter } from 'next/router'
import {
  InstanceImage,
  defaultInstanceImageOptions,
} from '../form/useSelectInstanceImage'
import {
  InstanceSpecs,
  defaultSpecsOptions,
} from '../form/useSelectInstanceSpecs'
import { useForm } from '../useForm'
import { Volume, defaultVolume } from '../form/useAddVolume'
import { EnvVar } from '../form/useAddEnvVars'
import { SSHKeyItem } from '../form/useAddSSHKeys'
import { InstanceManager } from '@/helpers/instance'

export type NewInstanceFormState = {
  name?: string
  tags?: string[]
  image?: InstanceImage
  specs?: InstanceSpecs
  volumes?: Volume[]
  envVars?: EnvVar[]
  sshKeys?: SSHKeyItem[]
}

export const initialState: NewInstanceFormState = {
  image: defaultInstanceImageOptions[0],
  specs: defaultSpecsOptions[0],
  volumes: [{ ...defaultVolume }],
}

export type UseNewInstancePage = {
  formState: NewInstanceFormState
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeEntityTab: (tabId: string) => void
  setFormValue: (name: keyof NewInstanceFormState, value: any) => void
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean

  handleChangeInstanceImage: (image: InstanceImage) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecs) => void
  handleChangeVolumes: (volumes: Volume[]) => void
  handleChangeEnvVars: (envVars: EnvVar[]) => void
  handleChangeSSHKeys: (sshKeys: SSHKeyItem[]) => void
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
    [router],
  )

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeInstanceImage = useCallback(
    (image: InstanceImage) => setFormValue('image', image),
    [setFormValue],
  )

  const handleChangeInstanceSpecs = useCallback(
    (specs: InstanceSpecs) => setFormValue('specs', specs),
    [setFormValue],
  )

  const handleChangeVolumes = useCallback(
    (volumes: Volume[]) => setFormValue('volumes', volumes),
    [setFormValue],
  )

  const handleChangeEnvVars = useCallback(
    (envVars: EnvVar[]) => setFormValue('envVars', envVars),
    [setFormValue],
  )

  const handleChangeSSHKeys = useCallback(
    (sshKeys: SSHKeyItem[]) => setFormValue('sshKeys', sshKeys),
    [setFormValue],
  )

  // const { totalCost } = useMemo(
  //   () =>
  //     getTotalProductCost({
  //       volumes: formState.volumes,
  //       cpu: formState.cpu,
  //       isPersistent: formState.isPersistent,
  //       capabilities: {},
  //     }),
  //   [formState],
  // )

  const totalCost = 0

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
    handleSubmit,
    setFormValue,
    handleChangeEntityTab,
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    handleChangeInstanceImage,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
    handleChangeEnvVars,
    handleChangeSSHKeys,
  }
}
