import { useAppState } from '@/contexts/appState'
import { Program } from '@/domain/program'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { useProgramManager } from './useProgramManager'

export function useAccountFunction(
  id: string,
): [Program | undefined, RequestState<unknown>] {
  const [appState, dispatch] = useAppState()
  const manager = useProgramManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.get(id)
  }, [manager, id])

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
      if (!manager) return
      defaultHandler(error)
    },
    [manager],
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
