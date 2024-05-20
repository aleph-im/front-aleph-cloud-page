import { Account } from '@aleph-sdk/account'
import { StoreReducer } from './store'
import { BlockchainId, ProviderId } from '@/domain/connect/base'

export type ConnectionState = {
  account?: Account
  balance?: number
  blockchain?: BlockchainId
  provider?: ProviderId
}

export const initialState: ConnectionState = {
  blockchain: BlockchainId.ETH,
  provider: undefined,
  account: undefined,
  balance: undefined,
}

export enum ConnectionActionType {
  CONNECTION_CONNECT = 'CONNECTION_CONNECT',
  CONNECTION_DISCONNECT = 'CONNECTION_DISCONNECT',
  CONNECTION_UPDATE = 'CONNECTION_UPDATE',
  CONNECTION_SET_BALANCE = 'CONNECTION_SET_BALANCE',
}

export class ConnectionConnectAction {
  readonly type = ConnectionActionType.CONNECTION_CONNECT
  constructor(
    public payload: {
      provider?: ProviderId
      blockchain: BlockchainId
    },
  ) {}
}

export class ConnectionDisconnectAction {
  readonly type = ConnectionActionType.CONNECTION_DISCONNECT
  payload = null
}

export class ConnectionUpdateAction {
  readonly type = ConnectionActionType.CONNECTION_UPDATE
  constructor(
    public payload: {
      account: Account
      provider: ProviderId
      blockchain: BlockchainId
      balance?: number
    },
  ) {}
}

export class ConnectionSetBalanceAction {
  readonly type = ConnectionActionType.CONNECTION_SET_BALANCE
  constructor(
    public payload: {
      balance: number
    },
  ) {}
}

export type ConnectionAction =
  | ConnectionConnectAction
  | ConnectionDisconnectAction
  | ConnectionUpdateAction
  | ConnectionSetBalanceAction

export type ConnectionReducer = StoreReducer<ConnectionState, ConnectionAction>

export function getConnectionReducer(): ConnectionReducer {
  return (state = initialState, action) => {
    switch (action.type) {
      case ConnectionActionType.CONNECTION_DISCONNECT: {
        return { ...initialState }
      }

      case ConnectionActionType.CONNECTION_CONNECT:
      case ConnectionActionType.CONNECTION_UPDATE:
      case ConnectionActionType.CONNECTION_SET_BALANCE: {
        return {
          ...state,
          ...action.payload,
        }
      }

      default: {
        return state
      }
    }
  }
}
