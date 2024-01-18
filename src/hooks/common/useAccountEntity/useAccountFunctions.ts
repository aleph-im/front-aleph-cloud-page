import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { Program } from '@/domain/program'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useProgramManager } from '../useManager/useProgramManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/core'

export type UseAccountFunctionsProps = {
  triggerOnMount?: boolean
}

export type UseAccountFunctionsReturn = [
  Program[] | undefined,
  UseRequestReturn<Program[]>,
]

export function useAccountFunctions({
  triggerOnMount = true,
}: UseAccountFunctionsProps = {}): UseAccountFunctionsReturn {
  const [appState, dispatch] = useAppState()
  const manager = useProgramManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.getAll()
  }, [manager])

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
      if (!manager) return
      defaultHandler(error)
    },
    [manager],
  )

  const reqState = useLocalRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount,
    triggerDeps: [appState.account],
  })

  const entities = appState.accountFunctions

  useRetryNotConfirmedEntities({
    entities,
    request: reqState.request,
    triggerOnMount,
  })

  return [entities, reqState]
}
