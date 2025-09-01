import { RequestState } from '@aleph-front/core'
import { StoreReducer, StoreAction } from './store'
import { ConnectionActionType } from './connection'

type CachedEntityName =
  | 'ssh'
  | 'domain'
  | 'instance'
  | 'gpuInstance'
  | 'confidential'
  | 'program'
  | 'volume'
  | 'website'
  | 'programVolume'
  | 'instanceVolume'
  | 'gpuInstanceVolume'
  | 'confidentialVolume'
  | 'ccns'
  | 'crns'

// Entity relationship mapping for cascade invalidation
// When ANY entity is deleted, clear ALL entity caches for complete consistency
export const ENTITY_RELATIONSHIPS: Record<
  CachedEntityName,
  CachedEntityName[]
> = {
  ssh: ['instance', 'gpuInstance', 'confidential', 'program'],
  domain: [
    'instance',
    'gpuInstance',
    'confidential',
    'program',
    'volume',
    'website',
  ],
  instance: ['ssh', 'domain', 'volume', 'instanceVolume'],
  gpuInstance: ['ssh', 'domain', 'volume', 'gpuInstanceVolume'],
  confidential: ['ssh', 'domain', 'volume', 'confidentialVolume'],
  program: ['ssh', 'domain', 'volume', 'programVolume'],
  volume: [
    'domain',
    'instance',
    'gpuInstance',
    'confidential',
    'program',
    'website',
    'programVolume',
    'instanceVolume',
    'gpuInstanceVolume',
    'confidentialVolume',
  ],
  website: ['domain', 'volume'],
  programVolume: ['volume', 'program'],
  instanceVolume: ['volume', 'instance'],
  gpuInstanceVolume: ['volume', 'gpuInstance'],
  confidentialVolume: ['volume', 'confidential'],
  ccns: ['crns'],
  crns: ['ccns'],
}

export type EntityState<T> = {
  keys: string[] | undefined
  entities: T[] | undefined
  loading: boolean
  error: Error | undefined
}

export const initialState: EntityState<never> = {
  keys: undefined,
  entities: undefined,
  loading: true,
  error: undefined,
}

export enum EntityActionType {
  ENTITY_SET = 'ENTITY_SET',
  ENTITY_LOAD = 'ENTITY_LOAD',
  ENTITY_SUCCESS = 'ENTITY_SUCCESS',
  ENTITY_ERROR = 'ENTITY_ERROR',
  ENTITY_ADD = 'ENTITY_ADD',
  ENTITY_DEL = 'ENTITY_DEL',
  ENTITY_CASCADE_INVALIDATE = 'ENTITY_CASCADE_INVALIDATE',
}

export class EntitySetAction<T> {
  readonly type = EntityActionType.ENTITY_SET
  constructor(public payload: { name: string; state: RequestState<T[]> }) {}
}

export class EntityLoadAction {
  readonly type = EntityActionType.ENTITY_LOAD
  constructor(public payload: { name: string }) {}
}

export class EntitySuccessAction<T> {
  readonly type = EntityActionType.ENTITY_SUCCESS
  constructor(public payload: { name: string; entities: T | T[] }) {}
}

export class EntityErrorAction {
  readonly type = EntityActionType.ENTITY_ERROR
  constructor(public payload: { name: string; error: Error }) {}
}

export class EntityAddAction<T> {
  readonly type = EntityActionType.ENTITY_ADD
  constructor(public payload: { name: string; entities: T | T[] }) {}
}

export class EntityDelAction {
  readonly type = EntityActionType.ENTITY_DEL
  constructor(
    public payload: {
      name: string
      keys: string | string[]
      cascadeInvalidate?: boolean
    },
  ) {}
}

export class EntityCascadeInvalidateAction {
  readonly type = EntityActionType.ENTITY_CASCADE_INVALIDATE
  constructor(public payload: { name: string }) {}
}

export type EntityAction<T> =
  | EntitySetAction<T>
  | EntityLoadAction
  | EntitySuccessAction<T>
  | EntityErrorAction
  | EntityAddAction<T>
  | EntityDelAction
  | EntityCascadeInvalidateAction

function addEntitiesToCollection<E>(
  entities: E[],
  collection: E[],
  key: keyof E,
): E[] {
  const map = new Map(collection.map((entity) => [entity[key], entity]))

  for (const entity of entities) {
    map.set(entity[key], entity)
  }

  return Array.from(map.values())
}

function addEntityToCollection<E>(
  entities: E | E[],
  collection: E[],
  key: keyof E,
): E[] {
  entities = Array.isArray(entities) ? entities : [entities]
  return addEntitiesToCollection(entities, collection, key)
}

function delEntityFromCollection<E>(
  ids: string | string[],
  collection: E[],
  key: keyof E,
): E[] {
  const idSet = new Set(Array.isArray(ids) ? ids : [ids])
  return collection.filter((e) => !idSet.has(e[key] as string))
}

function replaceCollection<E>(
  entities: E | E[],
  collection: E[],
  key: keyof E,
  virtualKey?: keyof E,
): E[] {
  entities = Array.isArray(entities) ? entities : [entities]

  collection = virtualKey
    ? collection.filter((e) => !e[virtualKey])
    : collection

  return addEntitiesToCollection(entities, collection, key)
}

function collectionKeys<E>(collection: E[], key: keyof E): string[] {
  return collection.map((e) => e[key] as string)
}

export function createCascadeInvalidationActions(
  entityName: CachedEntityName,
): EntityCascadeInvalidateAction[] {
  const relatedEntities = ENTITY_RELATIONSHIPS[entityName] || []
  return relatedEntities.map(
    (name) => new EntityCascadeInvalidateAction({ name }),
  )
}

export type EntityReducer<T> = StoreReducer<
  EntityState<T>,
  EntityAction<T> | StoreAction
>

export function getEntityReducer<E, K extends keyof E = keyof E>(
  name: string,
  key: K,
  virtualKey?: K,
): EntityReducer<E> {
  return (state = initialState, action) => {
    // Handle connection actions regardless of entity name
    if (
      action.type === ConnectionActionType.CONNECTION_CONNECT ||
      action.type === ConnectionActionType.CONNECTION_UPDATE ||
      action.type === ConnectionActionType.CONNECTION_DISCONNECT
    ) {
      // For CCN/CRN entities, preserve data since it's global and not account-specific
      if (name === 'ccns' || name === 'crns') {
        return state
      }

      // Reset all other cached entities when account connects, updates, or disconnects
      return {
        ...initialState,
      }
    }

    if (action.payload?.name !== name) return state

    switch (action.type) {
      case EntityActionType.ENTITY_SET: {
        const { data, ...rest } = action.payload.state

        const entities = data
        const keys = entities
          ? collectionKeys(entities, key as keyof E)
          : undefined

        return {
          ...state,
          ...rest,
          entities,
          keys,
        }
      }

      case EntityActionType.ENTITY_LOAD: {
        return {
          ...state,
          loading: true,
          error: undefined,
        }
      }

      case EntityActionType.ENTITY_SUCCESS: {
        const entities = replaceCollection(
          action.payload.entities,
          state.entities || [],
          key,
          virtualKey,
        )

        const keys = collectionKeys(entities, key)

        return {
          ...state,
          keys,
          entities,
          loading: false,
          error: undefined,
        }
      }

      case EntityActionType.ENTITY_ERROR: {
        return {
          ...state,
          loading: false,
          error: action.payload.error,
        }
      }

      case EntityActionType.ENTITY_ADD: {
        const entities = addEntityToCollection(
          action.payload.entities,
          state.entities || [],
          key,
        )

        const keys = collectionKeys(entities, key)

        return {
          ...state,
          keys,
          entities,
          loading: false,
          error: undefined,
        }
      }

      case EntityActionType.ENTITY_DEL: {
        const entities = delEntityFromCollection(
          action.payload.keys,
          state.entities || [],
          key,
        )

        const keys = collectionKeys(entities, key)

        return {
          ...state,
          keys,
          entities,
        }
      }

      case EntityActionType.ENTITY_CASCADE_INVALIDATE: {
        // Clear cache for related entities

        const keys = collectionKeys([], key)
        const entities = replaceCollection(
          [],
          state.entities || [],
          key,
          virtualKey,
        )

        return {
          ...state,
          keys,
          entities,
        }
      }

      default: {
        return state
      }
    }
  }
}
