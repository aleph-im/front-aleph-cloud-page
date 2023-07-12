import { useAppState } from '@/contexts/appState'
import { Instance } from '@/domain/instance'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { UseRequestReturn, useRequest } from '../useRequest'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useInstanceManager } from '../useManager/useInstanceManager'

export type UseAccountInstanceProps = {
  id: string
  triggerOnMount?: boolean
}

export type UseAccountInstanceReturn = [
  Instance | undefined,
  UseRequestReturn<Instance | undefined>,
]

export function useAccountInstance({
  id,
  triggerOnMount = true,
}: UseAccountInstanceProps): UseAccountInstanceReturn {
  const [appState, dispatch] = useAppState()
  const manager = useInstanceManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.get(id)
  }, [id, manager])

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
      if (!manager) return
      defaultHandler(error)
    },
    [manager],
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
    triggerOnMount,
  })

  useRetryNotConfirmedEntities({
    entities: instance,
    request: reqState.request,
    triggerOnMount,
  })

  return [instance, reqState]
}
