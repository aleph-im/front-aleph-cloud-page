import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { Program, ProgramManager } from '@/domain/program'

export function useAccountFunctions(): [
  Program[] | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const manager = new ProgramManager(account)
    return await manager.getAll()
  }, [account])

  const onSuccess = useCallback(
    (accountFunctions: Program[]) => {
      dispatch({
        type: ActionTypes.setAccountFunctions,
        payload: { accountFunctions },
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

  return [appState.accountFunctions, reqState]
}
