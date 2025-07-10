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
  loading: boolean
}

// Helper function to handle single entity requests (string ID)
const handleSingleEntityRequest = async <
  Entity extends ConfirmableEntity & { id: string },
>(
  manager: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>,
  entityId: string,
  currentState: { entities?: Entity[] },
  name: keyof StoreState,
): Promise<Entity[]> => {
  console.log(name, 'handling single entity request for ID:', entityId)

  // Check cache for single entity
  if (currentState?.entities?.length) {
    const cachedEntity = currentState.entities.find(
      (entity) => entity.id === entityId,
    )
    if (cachedEntity) {
      console.log(name, 'single entity found in cache')
      return [cachedEntity]
    }
  }

  // Fetch single entity
  const entity = await manager.get(entityId)
  return entity ? [entity] : []
}

// Helper function to handle multiple entities requests (array IDs)
const handleMultipleEntitiesRequest = async <
  Entity extends ConfirmableEntity & { id: string },
>(
  manager: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>,
  entityIds: string[],
  currentState: { entities?: Entity[] },
  name: keyof StoreState,
): Promise<Entity[]> => {
  console.log(name, 'handling multiple entities request for IDs:', entityIds)

  if (!entityIds.length) return []

  // Check cache for multiple entities
  if (currentState?.entities?.length) {
    const existingIds = currentState.entities.map((entity) => entity.id)
    const allEntitiesCached = entityIds.every((id) => existingIds.includes(id))

    if (allEntitiesCached) {
      console.log(name, 'all requested entities found in cache')
      return currentState.entities.filter((entity) =>
        entityIds.includes(entity.id),
      )
    }
  }

  // Fetch multiple entities
  return manager.getAll({ ids: entityIds })
}

// Helper function to handle all entities requests (no IDs specified)
const handleAllEntitiesRequest = async <
  Entity extends ConfirmableEntity & { id: string },
>(
  manager: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>,
  currentState: { entities?: Entity[] },
  name: keyof StoreState,
): Promise<Entity[]> => {
  console.log(name, 'handling all entities request')

  // Check cache for all entities
  if (currentState?.entities?.length) {
    console.log(name, 'returning cached entities')
    return currentState.entities
  }

  // Fetch all entities
  return manager.getAll({})
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

  const {
    data: entities,
    loading,
    request,
  } = useAppStoreEntityRequest({
    name,
    doRequest: async () => {
      if (!manager) return []

      const currentState = state[name] as { entities?: Entity[] }

      // Route to appropriate handler based on ids type
      if (typeof ids === 'string') {
        return handleSingleEntityRequest(manager, ids, currentState, name)
      } else if (Array.isArray(ids)) {
        return handleMultipleEntitiesRequest(manager, ids, currentState, name)
      } else {
        return handleAllEntitiesRequest(manager, currentState, name)
      }
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
    loading,
  }
}
