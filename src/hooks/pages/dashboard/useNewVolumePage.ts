import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { VolumeManager } from '@/domain/volume'
import { useAppState } from '@/contexts/appState'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import {
  NewVolumeProp,
  defaultVolume,
  VolumeProp,
} from '@/hooks/form/useAddVolume'

export type NewVolumeFormState = {
  volume: NewVolumeProp
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

      const volumeManager = new VolumeManager(account)
      await volumeManager.add(state.volume)

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
    (volume: VolumeProp) => setFormValue('volume', volume),
    [setFormValue],
  )

  const accountBalance = appState?.accountBalance || 0
  const totalCost = useMemo(
    () => VolumeManager.getVolumeTotalCost([formState.volume]),
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
