import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'

import { Instance } from '@/domain/instance'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useInstanceManager } from '../useManager/useInstanceManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/core'

export type UseAccountInstancesProps = {
  triggerOnMount?: boolean
}

export type UseAccountInstancesReturn = [
  Instance[] | undefined,
  UseRequestReturn<Instance[]>,
]

export function useAccountInstances({
  triggerOnMount = true,
}: UseAccountInstancesProps = {}): UseAccountInstancesReturn {
  const [appState, dispatch] = useAppState()
  const manager = useInstanceManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.getAll()
  }, [manager])

  const onSuccess = useCallback(
    (accountInstances: Instance[]) => {
      dispatch({
        type: ActionTypes.setAccountInstances,
        payload: { accountInstances },
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
    triggerOnMount: true,
    triggerDeps: [appState.account],
  })

  const entities = appState.accountInstances

  useRetryNotConfirmedEntities({
    entities,
    request: reqState.request,
    triggerOnMount,
  })

  return [entities, reqState]
}
