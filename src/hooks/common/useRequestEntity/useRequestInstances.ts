import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { Instance } from '@/domain/instance'
import { useInstanceManager } from '../useManager/useInstanceManager'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'

export type UseRequestInstancesProps = {
  id?: string
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestInstancesReturn = {
  entities?: Instance[]
}

export function useRequestInstances({
  id,
  triggerDeps = [],
  triggerOnMount = true,
}: UseRequestInstancesProps = {}): UseRequestInstancesReturn {
  const [state] = useAppState()
  const { account } = state.connection
  triggerDeps = [account, ...triggerDeps]

  const manager = useInstanceManager()

  const { data: entities, request } = useAppStoreEntityRequest({
    name: 'instance',
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
