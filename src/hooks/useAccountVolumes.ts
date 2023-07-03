import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { StoreMessage } from 'aleph-sdk-ts/dist/messages/types'
import { getAccountVolumes } from '@/helpers/aleph'

export function useAccountVolumes(): [
  StoreMessage[] | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    // @todo: Refactor
    return await getAccountVolumes(account)
  }, [account])

  const onSuccess = useCallback(
    (accountVolumes: StoreMessage[]) => {
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
