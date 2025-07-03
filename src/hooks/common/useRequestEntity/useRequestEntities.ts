import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import {
  ConfirmableEntity,
  useRetryNotConfirmedEntities,
} from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'
import { EntityManager, ReadOnlyEntityManager } from '@/domain/types'
import { StoreState } from '@/store/store'

export type UseRequestEntitiesProps<Entity> = {
  name: keyof StoreState
  manager?: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>
  ids?: string | string[]
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestEntitiesReturn<Entity> = {
  entities?: Entity[]
}

export function useRequestEntities<
  Entity extends ConfirmableEntity & { id: string },
>({
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

      // Check if data already exists in state
      const currentState = state[name] as { entities?: Entity[] }
      console.log(name, 'currentState', currentState)

      if (currentState?.entities && currentState.entities.length > 0) {
        console.log(name, 'entities present')
        // If requesting specific IDs, check if they exist in current state
        if (ids) {
          console.log(name, 'checking ids')

          const requestedIds = typeof ids === 'string' ? [ids] : ids
          const existingIds = currentState.entities.map((entity) => entity.id)
          const allExist = requestedIds.every((id) => existingIds.includes(id))

          if (allExist) {
            console.log(name, 'all ids exist')

            // Return filtered entities if all requested IDs exist
            return currentState.entities.filter((entity) =>
              requestedIds.includes(entity.id),
            )
          }
        } else {
          console.log(name, 'return entities')

          // If no specific IDs requested, return existing entities
          return currentState.entities
        }
      }

      if (typeof ids !== 'string') {
        if (ids && !ids.length) return []
        return manager.getAll({ ids })
      }

      const entity = await manager.get(ids)
      return entity ? [entity] : []
    },
    onSuccess: () => null,
    flushData: true,
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
