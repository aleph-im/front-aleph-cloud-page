import { Account } from '@aleph-sdk/account'
import { StoreReducer } from './store'
import { BlockchainId, ProviderId } from '@/domain/connect'
import { PaymentMethod } from '@/helpers/constants'

export type ConnectionState = {
  account?: Account
  balance?: number
  creditBalance?: number
  ethBalance?: number
  usdcBalance?: number
  blockchain?: BlockchainId
  provider?: ProviderId
  paymentMethod: PaymentMethod
  // Privy smart-wallet contract address controlled by the connected EOA.
  // Only set when provider === ProviderId.Privy; sender of sponsored credit top-ups.
  smartWalletAddress?: string
  // EOA address for Privy users — surfaced in header settings panel only.
  // Undefined for Reown users (their signing address is already their main address).
  eoaAddress?: string
}

export const initialState: ConnectionState = {
  blockchain: BlockchainId.ETH,
  provider: undefined,
  account: undefined,
  balance: undefined,
  paymentMethod: PaymentMethod.Hold,
}

export enum ConnectionActionType {
  CONNECTION_CONNECT = 'CONNECTION_CONNECT',
  CONNECTION_DISCONNECT = 'CONNECTION_DISCONNECT',
  CONNECTION_UPDATE = 'CONNECTION_UPDATE',
  CONNECTION_SET_BALANCE = 'CONNECTION_SET_BALANCE',
  CONNECTION_SET_PAYMENT_METHOD = 'CONNECTION_SET_PAYMENT_METHOD',
  CONNECTION_REFRESH_BALANCES = 'CONNECTION_REFRESH_BALANCES',
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
    } = {},
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
      creditBalance?: number
      smartWalletAddress?: string
      eoaAddress?: string
    },
  ) {}
}

export class ConnectionSetBalanceAction {
  readonly type = ConnectionActionType.CONNECTION_SET_BALANCE
  constructor(
    public payload: {
      balance: number
      creditBalance?: number
    },
  ) {}
}

export class ConnectionSetPaymentMethodAction {
  readonly type = ConnectionActionType.CONNECTION_SET_PAYMENT_METHOD
  constructor(
    public payload: {
      paymentMethod: PaymentMethod
    },
  ) {}
}

export class ConnectionRefreshBalancesAction {
  readonly type = ConnectionActionType.CONNECTION_REFRESH_BALANCES
  constructor(
    public payload: {
      balance: number
      creditBalance: number
      ethBalance: number
      usdcBalance: number
    },
  ) {}
}

export type ConnectionAction =
  | ConnectionConnectAction
  | ConnectionDisconnectAction
  | ConnectionUpdateAction
  | ConnectionSetBalanceAction
  | ConnectionSetPaymentMethodAction
  | ConnectionRefreshBalancesAction

export type ConnectionReducer = StoreReducer<ConnectionState, ConnectionAction>

export function getConnectionReducer(): ConnectionReducer {
  return (state = initialState, action) => {
    switch (action.type) {
      case ConnectionActionType.CONNECTION_DISCONNECT: {
        if (action.payload && action.payload.provider !== state.provider)
          return state

        // Keep the current payment method and blockchain selection but reset everything else
        return {
          ...initialState,
          paymentMethod: state.paymentMethod,
          blockchain: state.blockchain,
        }
      }

      case ConnectionActionType.CONNECTION_CONNECT:
      case ConnectionActionType.CONNECTION_UPDATE: {
        const { blockchain: currentBlockchain } = state
        const { blockchain } = action.payload

        // Use ?? instead of || to properly handle 0 balance
        let newBalance =
          (action as ConnectionUpdateAction).payload.balance ?? state.balance
        let newCreditBalance =
          (action as ConnectionUpdateAction).payload.creditBalance ||
          state.creditBalance

        // Reset balance when switching blockchains
        if (currentBlockchain && currentBlockchain !== blockchain) {
          newBalance = undefined
          newCreditBalance = undefined
        }

        return {
          ...state,
          ...action.payload,
          balance: newBalance,
          creditBalance: newCreditBalance,
        }
      }
      case ConnectionActionType.CONNECTION_SET_BALANCE: {
        return {
          ...state,
          ...action.payload,
        }
      }

      case ConnectionActionType.CONNECTION_SET_PAYMENT_METHOD: {
        return {
          ...state,
          ...action.payload,
        }
      }

      case ConnectionActionType.CONNECTION_REFRESH_BALANCES: {
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

export function selectDisplayAddress(
  connection: ConnectionState,
): string | undefined {
  if (connection.provider === ProviderId.Privy && connection.smartWalletAddress)
    return connection.smartWalletAddress
  return connection.account?.address
}
