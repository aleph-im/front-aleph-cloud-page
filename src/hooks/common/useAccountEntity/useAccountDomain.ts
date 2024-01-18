import { useAppState } from '@/contexts/appState'
import { Domain } from '@/domain/domain'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useDomainManager } from '../useManager/useDomainManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/core'

export type UseAccountDomainProps = {
  id: string
  triggerOnMount?: boolean
}

export type UseAccountDomainReturn = [
  Domain | undefined,
  UseRequestReturn<Domain | undefined>,
]

export function useAccountDomain({
  id,
  triggerOnMount = true,
}: UseAccountDomainProps): UseAccountDomainReturn {
  const [appState, dispatch] = useAppState()
  const manager = useDomainManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.get(id)
  }, [id, manager])

  const onSuccess = useCallback(
    (accountDomain: Domain | undefined) => {
      dispatch({
        type: ActionTypes.addAccountDomain,
        payload: { accountDomain },
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

  const domainKey = useMemo(
    () => (appState.accountDomains || []).find((key: Domain) => key.id === id),
    [appState.accountDomains, id],
  )

  const reqState = useLocalRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount,
  })

  useRetryNotConfirmedEntities({
    entities: domainKey,
    request: reqState.request,
    triggerOnMount,
  })

  return [domainKey, reqState]
}
