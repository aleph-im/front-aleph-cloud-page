import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { VolumeManager, VolumeType } from '@/domain/volume'
import { useAppState } from '@/contexts/appState'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { NewVolumeStandaloneField } from '@/hooks/form/useAddVolume'
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
import { ActionTypes } from '@/helpers/store'
import { Control } from 'react-hook-form'

export type NewVolumeFormState = {
  volume: NewVolumeStandaloneField
}

export const defaultValues: Partial<NewVolumeFormState> = {
  volume: { volumeType: VolumeType.New },
}

export type UseNewVolumePageReturn = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  handleSubmit: (e: FormEvent) => Promise<void>
  values: any
  control: Control<any>
}

export function useNewVolumePage(): UseNewVolumePageReturn {
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

  const { watch, control, handleSubmit } = useForm({ defaultValues, onSubmit })
  const values = watch()

  const accountBalance = appState?.accountBalance || 0
  const { totalCost } = useMemo(
    () => VolumeManager.getCost({ volumes: [values.volume] }),
    [values.volume],
  )

  const canAfford = accountBalance > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  return {
    address: account?.address || '',
    accountBalance: appState.accountBalance || 0,
    isCreateButtonDisabled,
    handleSubmit,
    values,
    control,
  }
}
