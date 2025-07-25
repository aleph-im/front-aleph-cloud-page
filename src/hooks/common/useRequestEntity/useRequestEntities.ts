import {
  CACHE_STRATEGY,
  useAppStoreEntityRequest,
} from '../useStoreEntitiesRequest'
import {
  ConfirmableEntity,
  useRetryNotConfirmedEntities,
} from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'
import { EntityManager, ReadOnlyEntityManager } from '@/domain/types'
import { StoreState } from '@/store/store'
import { useMemo } from 'react'

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

type RequestType = 'single' | 'multiple' | 'all'

// Helper function to handle single entity requests (string ID)
const handleSingleEntityRequest = async <
  Entity extends ConfirmableEntity & { id: string },
>(
  manager: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>,
  entityId: string,
  currentState: { entities?: Entity[] },
): Promise<Entity[]> => {
  // Check cache for single entity
  if (currentState?.entities?.length) {
    const cachedEntity = currentState.entities.find(
      (entity) => entity.id === entityId,
    )
    if (cachedEntity) {
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
): Promise<Entity[]> => {
  if (!entityIds.length) return []

  // Check cache for multiple entities
  if (currentState?.entities?.length) {
    const existingIds = currentState.entities.map((entity) => entity.id)
    const allEntitiesCached = entityIds.every((id) => existingIds.includes(id))

    if (allEntitiesCached) {
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
): Promise<Entity[]> => {
  // Check cache for all entities
  if (currentState?.entities?.length) {
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

  const requestType: RequestType = useMemo(() => {
    if (typeof ids === 'string') return 'single'
    if (Array.isArray(ids)) return 'multiple'
    return 'all'
  }, [ids])

  const cacheStrategy: CACHE_STRATEGY = useMemo(() => {
    switch (requestType) {
      case 'single':
        return 'none'
      case 'multiple':
        return 'merge'
      case 'all':
        return 'overwrite'
    }
  }, [requestType])

  const {
    data: entities,
    loading,
    request,
  } = useAppStoreEntityRequest({
    name,
    doRequest: async () => {
      if (!manager) return []

      const currentState = state[name] as { entities?: Entity[] }

      switch (requestType) {
        case 'single':
          return handleSingleEntityRequest(manager, ids as string, currentState)
        case 'multiple':
          return handleMultipleEntitiesRequest(
            manager,
            ids as string[],
            currentState,
          )
        case 'all':
          return handleAllEntitiesRequest(manager, currentState)
      }
    },
    onSuccess: () => null,
    flushData: true,
    triggerOnMount,
    triggerDeps,
    cacheStrategy,
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
