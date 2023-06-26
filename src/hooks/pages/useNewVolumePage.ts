import { useCallback, useMemo } from 'react'
import useConnectedWard from '../useConnectedWard'
import { useAppState } from '@/contexts/appState'
import { useRouter } from 'next/router'
import { getTotalProductCost } from '@/helpers/utils'
import {
  NewVolume,
  Volume,
  defaultVolume,
  displayVolumesToAlephVolumes,
} from '../form/useAddVolume'
import { useForm } from '../useForm'

export type NewVolumeFormState = {
  volume: NewVolume
}

export const initialState: NewVolumeFormState = {
  volume: { ...defaultVolume },
}

export function useNewVolumePage() {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account } = appState

  const onSubmit = useCallback(
    async (state: NewVolumeFormState) => {
      if (!account) throw new Error('Invalid account')
      await displayVolumesToAlephVolumes(account, [state.volume])
      router.replace('/dashboard')
    },
    [account, router],
  )

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeVolume = useCallback(
    (volume: Volume) => setFormValue('volume', volume),
    [setFormValue],
  )

  const accountBalance = appState?.accountBalance || 0
  const { totalCost } = useMemo(
    () =>
      getTotalProductCost({
        volumes: [formState.volume],
        cpu: 0,
        isPersistentStorage: false,
        capabilities: {},
      }),
    [formState],
  )

  const canAfford = accountBalance > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  return {
    formState,
    handleSubmit,
    handleChangeVolume,
    address: account?.address || '',
    accountBalance: appState.accountBalance || 0,
    isCreateButtonDisabled,
  }
}
