import { ConnectionState, getConnectionReducer } from './connection'
import { EntityState, getEntityReducer } from './entity'
import { SSHKey } from '@/domain/ssh'
import { Domain } from '@/domain/domain'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { Volume } from '@/domain/volume'
import { Website } from '@/domain/website'
import { ManagerState, getManagerReducer } from './manager'
import { Confidential } from '@/domain/confidential'
import { AuthorizationState, getAuthorizationReducer } from './authorization'
import { GpuInstance } from '@/domain/gpuInstance'
import { CCN, CRN, NodeLastVersions } from '@/domain/node'
import { RequestState, getRequestReducer } from './request'
import { RewardsResponse } from '@/domain/stake'
import { FilterState, getFilterReducer } from './filter'
import { ConfigState, getConfigReducer } from './config'

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
  // Connection/Auth
  connection: ConnectionState
  manager: ManagerState
  authorization: AuthorizationState
  config: ConfigState

  // Resource entities
  ssh: EntityState<SSHKey>
  domain: EntityState<Domain>
  instance: EntityState<Instance>
  gpuInstance: EntityState<GpuInstance>
  confidential: EntityState<Confidential>
  program: EntityState<Program>
  volume: EntityState<Volume>
  website: EntityState<Website>

  // Volume relationships
  programVolume: EntityState<Volume>
  instanceVolume: EntityState<Volume>
  gpuInstanceVolume: EntityState<Volume>
  confidentialVolume: EntityState<Volume>

  // Node entities (from account)
  ccns: EntityState<CCN>
  crns: EntityState<CRN>

  // Node-related requests
  lastCRNVersion: RequestState<NodeLastVersions>
  lastCCNVersion: RequestState<NodeLastVersions>
  lastRewardsDistribution: RequestState<RewardsResponse>
  lastRewardsCalculation: RequestState<RewardsResponse>

  // Filtering
  filter: FilterState
}

export const storeReducer = mergeReducers<StoreState>({
  // Connection/Auth
  connection: getConnectionReducer(),
  manager: getManagerReducer(),
  authorization: getAuthorizationReducer(),
  config: getConfigReducer(),

  // Resource entities
  ssh: getEntityReducer<SSHKey>('ssh', 'id'),
  domain: getEntityReducer<Domain>('domain', 'id'),
  instance: getEntityReducer<Instance>('instance', 'id'),
  gpuInstance: getEntityReducer<GpuInstance>('gpuInstance', 'id'),
  confidential: getEntityReducer<Confidential>('confidential', 'id'),
  program: getEntityReducer<Program>('program', 'id'),
  volume: getEntityReducer<Volume>('volume', 'id'),
  website: getEntityReducer<Website>('website', 'id'),

  // Volume relationships
  programVolume: getEntityReducer<Volume>('programVolume', 'id'),
  instanceVolume: getEntityReducer<Volume>('instanceVolume', 'id'),
  gpuInstanceVolume: getEntityReducer<Volume>('gpuInstanceVolume', 'id'),
  confidentialVolume: getEntityReducer<Volume>('confidentialVolume', 'id'),

  // Node entities (from account)
  ccns: getEntityReducer<CCN>('ccns', 'hash', 'virtual'),
  crns: getEntityReducer<CRN>('crns', 'hash', 'virtual'),

  // Node-related requests
  lastCRNVersion: getRequestReducer<NodeLastVersions>('lastCRNVersion'),
  lastCCNVersion: getRequestReducer<NodeLastVersions>('lastCCNVersion'),
  lastRewardsDistribution: getRequestReducer<RewardsResponse>(
    'lastRewardsDistribution',
  ),
  lastRewardsCalculation: getRequestReducer<RewardsResponse>(
    'lastRewardsCalculation',
  ),

  // Filtering
  filter: getFilterReducer(),
})

export const storeInitialState: StoreState = getInitialState(storeReducer)
