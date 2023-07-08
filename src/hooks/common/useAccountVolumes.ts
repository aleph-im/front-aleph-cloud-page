import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { Volume, VolumeManager } from '@/domain/volume'

export function useAccountVolumes(): [
  Volume[] | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const volumeManager = new VolumeManager(account)
    return await volumeManager.getAll()
  }, [account])

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
      if (!account) return
      defaultHandler(error)
    },
    [account],
  )

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount: true,
  })

  return [appState.accountVolumes, reqState]
}
