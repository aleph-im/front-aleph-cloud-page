import { useAppState } from '@/contexts/appState'
import { AccountFilesResponse, getAccountFileStats } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

// Silent fallback for faulty data
const fallbackPayload: AccountFilesResponse = {
  address: '',
  files: [],
  total_size: 0,
}

export function useGetFileSize(): [
  AccountFilesResponse,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const fileStats = useMemo(
    () => appState.accountFiles || fallbackPayload,
    [appState.accountFiles],
  )

  const { account } = appState

  const doRequest = useCallback(() => {
    if (!account) throw new Error('Invalid account')

    return getAccountFileStats(account)
  }, [account])

  const onSuccess = useCallback(
    (accountFiles: AccountFilesResponse) => {
      dispatch({ type: ActionTypes.setAccountFiles, payload: { accountFiles } })
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

  return [fileStats, reqState]
}
