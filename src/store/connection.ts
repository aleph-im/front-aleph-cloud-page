import { Account } from '@aleph-sdk/account'
import { ModalCardProps } from '@aleph-front/core'
import { StoreReducer } from './store'
import {
  BlockchainId,
  defaultBlockchainProviders,
  ProviderId,
} from '@/domain/connect/base'

export type ConnectionConfirmationModal = <Action extends ConnectionAction>(
  action: { new (payload: Action['payload']): Action },
  payload: Action['payload'],
) => ModalCardProps

export type ConnectionState = {
  account?: Account
  balance?: number
  blockchain?: BlockchainId
  provider?: ProviderId
  waitingConfirmation?: boolean
  confirmationModal?: ConnectionConfirmationModal
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
  CONNECTION_CONFIRM_UPDATE = 'CONNECTION_CONFIRM_UPDATE',
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

export class ConnectionConfirmUpdateAction {
  readonly type = ConnectionActionType.CONNECTION_CONFIRM_UPDATE
  constructor(
    public payload: {
      waitingConfirmation?: ConnectionState['waitingConfirmation']
      confirmationModal?: ConnectionState['confirmationModal']
    },
  ) {}
}

export type ConnectionAction =
  | ConnectionConnectAction
  | ConnectionDisconnectAction
  | ConnectionUpdateAction
  | ConnectionSetBalanceAction
  | ConnectionConfirmUpdateAction

export type ConnectionReducer = StoreReducer<ConnectionState, ConnectionAction>

export function getConnectionReducer(): ConnectionReducer {
  return (state = initialState, action) => {
    switch (action.type) {
      case ConnectionActionType.CONNECTION_DISCONNECT: {
        if (action.payload && action.payload.provider !== state.provider)
          return state

        return { ...initialState }
      }

      case ConnectionActionType.CONNECTION_CONNECT:
      case ConnectionActionType.CONNECTION_UPDATE: {
        const { provider: currentProvider, blockchain: currentBlockchain } =
          state
        const { provider, blockchain } = action.payload

        let newProvider = provider
        let newBalance =
          (action as ConnectionUpdateAction).payload.balance || state.balance

        // If we are switching between EVM and Solana, hardcode the provider
        if (currentProvider) {
          const isSwitchingToSolana =
            currentBlockchain !== BlockchainId.SOL &&
            blockchain === BlockchainId.SOL
          const isSwitchingToEVM =
            currentBlockchain === BlockchainId.SOL &&
            blockchain !== BlockchainId.SOL

          newProvider =
            isSwitchingToSolana || isSwitchingToEVM
              ? defaultBlockchainProviders[blockchain]
              : newProvider
        }

        // If we are switching blockchains, reset the balance
        if (currentBlockchain && currentBlockchain !== blockchain)
          newBalance = undefined

        return {
          ...state,
          ...action.payload,
          provider: newProvider,
          balance: newBalance,
        }
      }
      case ConnectionActionType.CONNECTION_SET_BALANCE: {
        return {
          ...state,
          ...action.payload,
        }
      }
      case ConnectionActionType.CONNECTION_CONFIRM_UPDATE: {
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
