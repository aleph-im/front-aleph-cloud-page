import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useReducer } from 'react'
import useConnectedWard from '../useConnectedWard'
import { useRequestState } from '../useRequestState'
import { useRouter } from 'next/router'
import { Runtime, RuntimeId } from '../form/useRuntimeSelector'
import { InstanceSpecs } from '../form/useInstanceSpecsSelector'

// @todo: Split this into reusable hooks by composition

export type NewInstanceFormState = {
  runtime?: RuntimeId
  cpu?: number
  ram?: number
}

export const initialFormState = {
  runtime: undefined,
}

export type NewInstancePage = {
  formState: NewInstanceFormState
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeEntityTab: (tabId: string) => void
  setFormValue: (name: keyof NewInstanceFormState, value: any) => void
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean

  handleChangeRuntime: (image: Runtime) => void
  handleChangeInstanceSpecs: (specs: InstanceSpecs) => void
}

export function useNewInstancePage(): NewInstancePage {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account, accountBalance } = appState

  const [formState, dispatchForm] = useReducer(
    (
      state: NewInstanceFormState,
      action: { type: string; payload: any },
    ): NewInstanceFormState => {
      switch (action.type) {
        case 'SET_VALUE':
          return {
            ...state,
            [action.payload.name]: action.payload.value,
          }

        default:
          return state
      }
    },
    initialFormState,
  )

  const [, { onLoad, onSuccess, onError }] = useRequestState()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      onLoad()

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }

  const setFormValue = useCallback(
    (name: keyof NewInstanceFormState, value: any) =>
      dispatchForm({ type: 'SET_VALUE', payload: { name, value } }),
    [],
  )

  const handleChangeRuntime = useCallback(
    (image: Runtime) => {
      setFormValue('runtime', image.id)
    },
    [setFormValue],
  )

  const handleChangeInstanceSpecs = useCallback(
    (specs: InstanceSpecs) => {
      setFormValue('cpu', specs.cpu)
      setFormValue('ram', specs.ram)
    },
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
  }
}
