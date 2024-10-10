import { Account } from '@aleph-sdk/account'
import { StoreReducer } from './store'
import {
  BlockchainId,
  defaultBlockchainProviders,
  ProviderId,
} from '@/domain/connect/base'

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
  constructor(
    public payload: {
      provider?: ProviderId
      error?: Error
    },
  ) {}
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
  console.log('Inside CONNECTION REDUCER')

  return (state = initialState, action) => {
    switch (action.type) {
      case ConnectionActionType.CONNECTION_DISCONNECT: {
        console.log('DISCONNECTING', action.payload)
        console.log('State', state)

        if (action.payload && action.payload.provider !== state.provider)
          return state

        console.log('RESETTING Connection state', action.payload)

        return { ...initialState }
      }

      case ConnectionActionType.CONNECTION_CONNECT: {
        console.log('CONNECTING')
      }
      case ConnectionActionType.CONNECTION_UPDATE: {
        console.log('UPDATING Connection', action.payload)
        const { provider: initialProvider, blockchain: initialBlockchain } =
          state
        const { provider, blockchain } = action.payload

        let newProvider = provider
        let newBalance =
          (action as ConnectionUpdateAction).payload.balance || state.balance

        // If we are switching between EVM and Solana, we need to hardcode the provider
        if (initialProvider) {
          const isSwitchingToSolana =
            initialBlockchain !== BlockchainId.SOL &&
            blockchain === BlockchainId.SOL
          const isSwitchingToEVM =
            initialBlockchain === BlockchainId.SOL &&
            blockchain !== BlockchainId.SOL

          newProvider =
            isSwitchingToSolana || isSwitchingToEVM
              ? defaultBlockchainProviders[blockchain]
              : newProvider

          if (initialProvider !== newProvider)
            console.log('Hardcoding provider to', newProvider)
        }

        // If we are switching blockchains, we need to reset the balance
        if (initialBlockchain && initialBlockchain !== blockchain) {
          console.log('Switching blockchains, resetting account and balance')
          newBalance = undefined
        }

        const newState = {
          ...state,
          ...action.payload,
          provider: newProvider,
          balance: newBalance,
        }

        console.log('NEW STATE', newState)
        return newState
      }
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
