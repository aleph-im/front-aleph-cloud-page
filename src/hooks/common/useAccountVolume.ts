import { useAppState } from '@/contexts/appState'
import { Volume } from '@/domain/volume'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { useVolumeManager } from './useVolumeManager'

export function useAccountVolume(
  id: string,
): [Volume | undefined, RequestState<unknown>] {
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

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount: !volume,
  })

  return [volume, reqState]
}
