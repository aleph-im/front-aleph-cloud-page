import { ConnectionState, getConnectionReducer } from './connection'
import { EntityState, getEntityReducer } from './entity'
import { SSHKey } from '@/domain/ssh'
import { Domain } from '@/domain/domain'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { Volume } from '@/domain/volume'
import { Website } from '@/domain/website'
import { ManagerState, getManagerReducer } from './manager'

export type StoreSubstate = Record<string, unknown>

export type StoreAction<T = any, P = any> = {
  readonly type: T
  payload: P | undefined
}

export type StoreReducer<S extends StoreSubstate, A extends StoreAction> = (
  state: S,
  action: A,
) => S

export function mergeReducers<RootState extends Record<string, StoreSubstate>>(
  reducers: Record<keyof RootState, StoreReducer<any, StoreAction>>,
): StoreReducer<RootState, StoreAction> {
  return (state, action) => {
    for (const [slice, reducer] of Object.entries(reducers)) {
      const prevSubstate = state[slice]
      const newSubstate = reducer(prevSubstate, action)

      if (newSubstate === prevSubstate) continue

      state = {
        ...state,
        [slice]: newSubstate,
      }
    }

    return state
  }
}

export function getInitialState<
  RootState extends Record<string, StoreSubstate>,
>(reducer: StoreReducer<RootState, StoreAction>): RootState {
  return reducer({} as RootState, { type: 'INITIAL_STATE', payload: undefined })
}

export type StoreState = {
  connection: ConnectionState
  manager: ManagerState
  ssh: EntityState<SSHKey>
  domain: EntityState<Domain>
  instance: EntityState<Instance>
  program: EntityState<Program>
  volume: EntityState<Volume>
  website: EntityState<Website>

  programVolume: EntityState<Volume>
  instanceVolume: EntityState<Volume>
}

export const storeReducer = mergeReducers<StoreState>({
  connection: getConnectionReducer(),
  manager: getManagerReducer(),
  ssh: getEntityReducer<SSHKey>('ssh', 'id'),
  domain: getEntityReducer<Domain>('domain', 'id'),
  instance: getEntityReducer<Instance>('instance', 'id'),
  program: getEntityReducer<Program>('program', 'id'),
  volume: getEntityReducer<Volume>('volume', 'id'),
  website: getEntityReducer<Website>('website', 'id'),

  // @note: refactor this entities
  programVolume: getEntityReducer<Volume>('programVolume', 'id'),
  instanceVolume: getEntityReducer<Volume>('instanceVolume', 'id'),
})

export const storeInitialState: StoreState = getInitialState(storeReducer)
