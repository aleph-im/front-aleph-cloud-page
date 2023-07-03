import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { ProgramMessage } from 'aleph-sdk-ts/dist/messages/types'
import { getAccountFunctions } from '@/helpers/aleph'

export function useAccountFunctions(): [
  ProgramMessage[] | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    return await getAccountFunctions(account)
  }, [account])

  const onSuccess = useCallback(
    (accountFunctions: ProgramMessage[]) => {
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
