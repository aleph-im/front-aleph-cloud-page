import { useAppState } from '@/contexts/appState'
import {
  AccountFileObject,
  AccountFilesResponse,
  getAccountFileStats,
} from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

export function useGetFileSize(): [
  AccountFilesResponse,
  RequestState<unknown>,
] {
  // Silent fallback for faulty data
  const fallbackPayload: AccountFilesResponse = {
    address: '',
    files: [],
    total_size: 0,
  }

  const [appState, dispatch] = useAppState()
  const fileStats = useMemo(
    () => appState.accountFiles || fallbackPayload,
    [appState],
  )

  const { account } = appState

  const doRequest = useCallback(() => {
    if (!account) throw new Error('You need to be logged in to see this page.')
    return getAccountFileStats(account)
  }, [account])

  const onSuccess = useCallback(
    (accountFiles: AccountFilesResponse) => {
      dispatch({ type: ActionTypes.setAccountFiles, payload: { accountFiles } })
    },
    [dispatch],
  )

  const reqState = useRequest({ doRequest, onSuccess, triggerOnMount: true })

  return [fileStats, reqState]
}
