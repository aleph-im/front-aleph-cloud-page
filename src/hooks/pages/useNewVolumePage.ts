import { FormEvent, useState } from 'react'
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

export function useNewVolumePage() {
  useConnectedWard()

  const [reqState, { onLoad, onSuccess, onError }] = useRequestState()
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
      const alephVolumes = await displayVolumesToAlephVolumes(account, [
        volumeState,
      ])

      onSuccess(true)
      router.replace('/solutions/dashboard')
    } catch (err) {
      onError(err as Error)
    }
  }

  return {
    setVolumeProperty,
    setVolumeType,
    handleSubmit,
    volumeState,
    address: account?.address || '',
    accountBalance: appState.accountBalance || 0,
  }
}
