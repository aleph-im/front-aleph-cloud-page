import { useAppState } from '@/contexts/appState'
import { Program, ProgramManager } from '@/domain/program'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

export function useAccountFunction(
  id: string,
): [Program | undefined, RequestState<unknown>] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const functionStore = new ProgramManager(account)
    return await functionStore.get(id)
  }, [account, id])

  const onSuccess = useCallback(
    (accountFunction: Program | undefined) => {
      dispatch({
        type: ActionTypes.addAccountFunction,
        payload: { accountFunction },
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

  const fn = useMemo(
    () =>
      (appState.accountFunctions || []).find((key: Program) => key.id === id),
    [appState.accountFunctions, id],
  )

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount: !fn,
  })

  return [fn, reqState]
}
