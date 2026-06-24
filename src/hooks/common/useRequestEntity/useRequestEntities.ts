import {
  CACHE_STRATEGY,
  useAppStoreEntityRequest,
} from '../useStoreEntitiesRequest'
import { useEntitiesMessageStatus } from '../useEntitiesMessageStatus'
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
  /**
   * Overlay each entity with its aleph message status (Requesting/Ready/…).
   * Only for message-based resources whose `id` is a message item hash;
   * aggregate-based entities (domains/websites) should leave this off.
   */
  withMessageStatus?: boolean
}

export type UseRequestEntitiesReturn<Entity> = {
  entities?: Entity[]
  loading: boolean
  refetch: () => Promise<void>
}

type RequestType = 'single' | 'multiple' | 'all'

// Helper function to handle single entity requests (string ID)
const handleSingleEntityRequest = async <Entity extends { id: string }>(
  manager: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>,
  entityId: string,
  currentState: { entities?: Entity[] },
  force = false,
): Promise<Entity[]> => {
  // Check cache for single entity (skip if force is true)
  if (!force && currentState?.entities?.length) {
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
const handleMultipleEntitiesRequest = async <Entity extends { id: string }>(
  manager: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>,
  entityIds: string[],
  currentState: { entities?: Entity[] },
  force = false,
): Promise<Entity[]> => {
  if (!entityIds.length) return []

  // Check cache for multiple entities (skip if force is true)
  if (!force && currentState?.entities?.length) {
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
const handleAllEntitiesRequest = async <Entity extends { id: string }>(
  manager: EntityManager<Entity, any> | ReadOnlyEntityManager<Entity>,
  currentState: { entities?: Entity[] },
  force = false,
): Promise<Entity[]> => {
  // Check cache for all entities (skip if force is true)
  if (!force && currentState?.entities?.length) {
    return currentState.entities
  }

  // Fetch all entities
  return manager.getAll({})
}

export function useRequestEntities<Entity extends { id: string }>({
  name,
  manager,
  ids,
  triggerDeps = [],
  triggerOnMount = true,
  withMessageStatus = false,
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
        return 'merge'
      case 'multiple':
        return 'merge'
      case 'all':
        return 'overwrite'
    }
  }, [requestType])

  const { data: allEntities, loading } = useAppStoreEntityRequest({
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

  // Force request handler for refetch (bypasses cache)
  const { request: forceRequest } = useAppStoreEntityRequest({
    name,
    doRequest: async () => {
      if (!manager) return []

      const currentState = state[name] as { entities?: Entity[] }

      switch (requestType) {
        case 'single':
          return handleSingleEntityRequest(
            manager,
            ids as string,
            currentState,
            true,
          )
        case 'multiple':
          return handleMultipleEntitiesRequest(
            manager,
            ids as string[],
            currentState,
            true,
          )
        case 'all':
          return handleAllEntitiesRequest(manager, currentState, true)
      }
    },
    onSuccess: () => null,
    flushData: true,
    triggerOnMount: false,
    triggerDeps: [],
    cacheStrategy,
  })

  // Filter entities based on request type
  const filteredEntities = useMemo(() => {
    if (!allEntities) return allEntities

    switch (requestType) {
      case 'single':
        return allEntities.filter((entity) => entity.id === (ids as string))
      case 'multiple':
        return allEntities.filter((entity) =>
          (ids as string[]).includes(entity.id),
        )
      case 'all':
        return allEntities
      default:
        return allEntities
    }
  }, [allEntities, requestType, ids])

  const statusMap = useEntitiesMessageStatus(
    withMessageStatus && triggerOnMount ? filteredEntities : undefined,
  )

  const entitiesWithStatus = useMemo(() => {
    if (!filteredEntities || !withMessageStatus) return filteredEntities
    return filteredEntities.map((entity) => ({
      ...entity,
      status: statusMap[entity.id],
    }))
  }, [filteredEntities, statusMap, withMessageStatus])

  return {
    entities: entitiesWithStatus,
    loading,
    refetch: forceRequest,
  }
}
