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
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
import { ActionTypes } from '@/helpers/store'

export type NewVolumeFormState = {
  volume: NewVolumeProp
}

export const initialState: NewVolumeFormState = {
  volume: { ...defaultVolume },
}

export function useNewVolumePage() {
  useConnectedWard()

  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const manager = useVolumeManager()

  const onSubmit = useCallback(
    async (state: NewVolumeFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const [accountVolume] = await manager.add(state.volume)

      dispatch({
        type: ActionTypes.addAccountVolume,
        payload: { accountVolume },
      })

      router.replace('/dashboard')
    },
    [dispatch, manager, router],
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
