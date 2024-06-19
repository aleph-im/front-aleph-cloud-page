import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import {
  ConfirmableEntity,
  useRetryNotConfirmedEntities,
} from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'
import { EntityManager } from '@/domain/types'
import { StoreState } from '@/store/store'

export type UseRequestEntitiesProps<Entity> = {
  name: keyof StoreState
  manager?: EntityManager<Entity, any>
  ids?: string | string[]
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestEntitiesReturn<Entity> = {
  entities?: Entity[]
}

export function useRequestEntities<Entity extends ConfirmableEntity>({
  name,
  manager,
  ids,
  triggerDeps = [],
  triggerOnMount = true,
}: UseRequestEntitiesProps<Entity>): UseRequestEntitiesReturn<Entity> {
  const [state] = useAppState()
  const { account } = state.connection
  triggerDeps = [account, ids, ...triggerDeps]

  const { data: entities, request } = useAppStoreEntityRequest({
    name,
    doRequest: async () => {
      if (!manager) return []

      if (typeof ids !== 'string') {
        if (ids && !ids.length) return []
        return manager.getAll({ ids })
      }

      const entity = await manager.get(ids)
      return entity ? [entity] : []
    },
    onSuccess: () => null,
    flushData: false,
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
