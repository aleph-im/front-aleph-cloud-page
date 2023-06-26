import { FormEvent, useMemo, useState } from 'react'
import useConnectedWard from '../useConnectedWard'
import {
  defaultVolume,
  displayVolumesToAlephVolumes,
  Volume,
  VolumeTypes,
} from '@/helpers/form'
import { useAppState } from '@/contexts/appState'
import { useRequestState } from '../useRequestState'
import { useRouter } from 'next/router'
import { getTotalProductCost } from '@/helpers/utils'

export function useNewVolumePage() {
  useConnectedWard()

  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const router = useRouter()
  const [appState] = useAppState()
  const { account } = appState

  const [volumeState, setVolumeState] = useState(defaultVolume)
  const setVolumeProperty = (key: keyof Volume, value: any) => {
    setVolumeState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const setVolumeType = (volumeType: VolumeTypes) => {
    setVolumeProperty('type', volumeType)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!account) return

    onLoad()

    try {
      await displayVolumesToAlephVolumes(account, [volumeState])

      onSuccess(true)
      router.replace('/dashboard')
    } catch (err) {
      onError(err as Error)
    }
  }

  const accountBalance = appState?.accountBalance || 0
  const { totalCost } = useMemo(
    () =>
      getTotalProductCost({
        volumes: [volumeState],
        cpu: 0,
        isPersistentStorage: false,
        capabilities: {},
      }),
    [volumeState],
  )

  const canAfford = accountBalance > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  return {
    setVolumeProperty,
    setVolumeType,
    handleSubmit,
    volumeState,
    address: account?.address || '',
    accountBalance: appState.accountBalance || 0,
    isCreateButtonDisabled,
  }
}
