import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { AccountFilesResponse, FileManager } from '@/domain/file'

export function useAccountFiles(): [
  AccountFilesResponse | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const manager = new FileManager(account)
    return await manager.getAll()
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

  return [appState.accountFiles, reqState]
}
