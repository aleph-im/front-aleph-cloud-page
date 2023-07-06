import { useAppState } from '@/contexts/appState'
import { Instance, InstanceManager } from '@/domain/instance'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

export function useAccountInstance(
  id: string,
): [Instance | undefined, RequestState<unknown>] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const instanceStore = new InstanceManager(account)
    return await instanceStore.get(id)
  }, [account, id])

  const onSuccess = useCallback(
    (accountInstance: Instance | undefined) => {
      dispatch({
        type: ActionTypes.addAccountInstance,
        payload: { accountInstance },
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

  const instance = useMemo(
    () =>
      (appState.accountInstances || []).find((key: Instance) => key.id === id),
    [appState.accountInstances, id],
  )

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount: !instance,
  })

  return [instance, reqState]
}
