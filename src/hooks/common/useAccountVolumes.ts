import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { Volume } from '@/domain/volume'
import { useVolumeManager } from './useVolumeManager'

export function useAccountVolumes(): [
  Volume[] | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const manager = useVolumeManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.getAll()
  }, [manager])

  const onSuccess = useCallback(
    (accountVolumes: Volume[]) => {
      dispatch({
        type: ActionTypes.setAccountVolumes,
        payload: { accountVolumes },
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

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount: true,
  })

  return [appState.accountVolumes, reqState]
}
