import { useAppState } from '@/contexts/appState'
import { Volume, VolumeManager } from '@/domain/volume'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

export function useAccountVolume(
  id: string,
): [Volume | undefined, RequestState<unknown>] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const volumeStore = new VolumeManager(account)
    return await volumeStore.get(id)
  }, [account, id])

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
      if (!account) return
      defaultHandler(error)
    },
    [account],
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
