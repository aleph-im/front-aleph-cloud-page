import { useAppState } from '@/contexts/appState'
import { Domain } from '@/domain/domain'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useDomainManager } from '../useManager/useDomainManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/core'
import Err from '@/helpers/errors'

export type UseAccountDomainsProps = {
  triggerOnMount?: boolean
}

export type UseAccountDomainsReturn = [
  Domain[] | undefined,
  UseRequestReturn<Domain[]>,
]

export function useAccountDomains({
  triggerOnMount = true,
}: UseAccountDomainsProps = {}): UseAccountDomainsReturn {
  const [appState, dispatch] = useAppState()
  const manager = useDomainManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw Err.ManagerNotReady

    return await manager.getAll()
  }, [manager])

  const onSuccess = useCallback(
    (accountDomains: Domain[]) => {
      dispatch({
        type: ActionTypes.setAccountDomains,
        payload: { accountDomains },
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

  const entities = appState.accountDomains

  useRetryNotConfirmedEntities({
    entities,
    request: reqState.request,
    triggerOnMount,
  })

  return [entities, reqState]
}
