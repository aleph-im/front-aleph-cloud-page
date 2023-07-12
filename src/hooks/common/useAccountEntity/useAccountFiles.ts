import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { AccountFilesResponse } from '@/domain/file'
import { useFileManager } from '../useManager/useFileManager'
import { RequestState } from '../useRequestState'
import { useRequest } from '../useRequest'

export function useAccountFiles(): [
  AccountFilesResponse | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const manager = useFileManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.getAll()
  }, [manager])

  const onSuccess = useCallback(
    (accountFiles: AccountFilesResponse) => {
      dispatch({ type: ActionTypes.setAccountFiles, payload: { accountFiles } })
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

  return [appState.accountFiles, reqState]
}
