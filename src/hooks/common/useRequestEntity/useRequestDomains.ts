import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { Domain } from '@/domain/domain'
import { useDomainManager } from '../useManager/useDomainManager'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'

export type UseRequestDomainsProps = {
  id?: string
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestDomainsReturn = {
  entities?: Domain[]
}

export function useRequestDomains({
  id,
  triggerDeps = [],
  triggerOnMount = true,
}: UseRequestDomainsProps = {}): UseRequestDomainsReturn {
  const [state] = useAppState()
  const { account } = state.connection
  triggerDeps = [account, ...triggerDeps]

  const manager = useDomainManager()

  const { data: entities, request } = useAppStoreEntityRequest({
    name: 'domain',
    doRequest: async () => {
      if (!manager) return []

      if (!id) {
        return manager.getAll()
      } else {
        const entity = await manager.get(id)
        return entity ? [entity] : []
      }
    },
    onSuccess: () => null,
    flushData: !id,
    triggerOnMount,
    triggerDeps,
  })

  useRetryNotConfirmedEntities({
    entities,
    request,
    triggerOnMount,
  })

  return {
    entities,
  }
}
