import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { Website } from '@/domain/website'
import { useWebsiteManager } from '../useManager/useWebsiteManager'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'

export type UseRequestWebsitesProps = {
  id?: string
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestWebsitesReturn = {
  entities?: Website[]
}

export function useRequestWebsites({
  id,
  triggerDeps = [],
  triggerOnMount = true,
}: UseRequestWebsitesProps = {}): UseRequestWebsitesReturn {
  const [state] = useAppState()
  const { account } = state.connection
  triggerDeps = [account, ...triggerDeps]

  const manager = useWebsiteManager()

  const { data: entities, request } = useAppStoreEntityRequest({
    name: 'website',
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
