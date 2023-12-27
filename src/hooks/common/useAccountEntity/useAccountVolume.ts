import { useAppState } from '@/contexts/appState'
import { Volume } from '@/domain/volume'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useVolumeManager } from '../useManager/useVolumeManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/aleph-core'

export type UseAccountVolumeProps = {
  id: string
  triggerOnMount?: boolean
}

export type UseAccountVolumeReturn = [
  Volume | undefined,
  UseRequestReturn<Volume | undefined>,
]

export function useAccountVolume({
  id,
  triggerOnMount = true,
}: UseAccountVolumeProps): UseAccountVolumeReturn {
  const [appState, dispatch] = useAppState()
  const manager = useVolumeManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.get(id)
  }, [manager, id])

  const onSuccess = useCallback(
    (accountVolume: Volume | undefined) => {
      dispatch({
        type: ActionTypes.addAccountVolume,
        payload: { accountVolume },
      })
    },
    [dispatch],
  )

  const onError = useCallback(
    (error: Error, defaultHandler: (error: Error) => void) => {
      if (!manager) return
      defaultHandler(error)
    },
    [manager],
  )

  const volume = useMemo(
    () => (appState.accountVolumes || []).find((key: Volume) => key.id === id),
    [appState.accountVolumes, id],
  )

  const reqState = useLocalRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount,
  })

  useRetryNotConfirmedEntities({
    entities: volume,
    request: reqState.request,
    triggerOnMount,
  })

  return [volume, reqState]
}
