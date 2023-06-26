import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback } from 'react'
import useConnectedWard from '../useConnectedWard'
import { useRouter } from 'next/router'
import { Runtime, defaultRuntimeOptions } from '../form/useRuntimeSelector'
import {
  InstanceSpecs,
  defaultSpecsOptions,
} from '../form/useInstanceSpecsSelector'
import { useForm } from '../useForm'
import { Volume, defaultVolume } from '../form/useAddVolume'

// @todo: Split this into reusable hooks by composition

export type NewInstanceFormState = {
  runtime?: Runtime
  specs?: InstanceSpecs
  volumes?: Volume[]
}

export const initialState: NewInstanceFormState = {
  runtime: defaultRuntimeOptions[0],
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

  handleChangeRuntime: (runtime: Runtime) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecs) => void
  handleChangeVolumes: (volumes: Volume[]) => void
}

export function useNewInstancePage(): UseNewInstancePage {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account, accountBalance } = appState

  const onSubmit = useCallback(
    async (state: NewInstanceFormState) => {
      console.log(state)
      router.replace('/dashboard')
    },
    [router],
  )

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeRuntime = useCallback(
    (runtime: Runtime) => setFormValue('runtime', runtime),
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
    handleChangeRuntime,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
  }
}
