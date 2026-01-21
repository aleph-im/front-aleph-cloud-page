import { StoreReducer } from './store'

export type UIState = {
  isTopUpCreditsModalOpen: boolean
  topUpCreditsMinimumBalance?: number
  // The txHash of the payment currently focused for auto-tracking UI
  // When null, no auto-focus - user has dismissed or interacted with another payment
  focusedPaymentTxHash: string | null
}

export const initialUIState: UIState = {
  isTopUpCreditsModalOpen: false,
  topUpCreditsMinimumBalance: undefined,
  focusedPaymentTxHash: null,
}

export enum UIActionType {
  OPEN_TOP_UP_CREDITS_MODAL = 'OPEN_TOP_UP_CREDITS_MODAL',
  CLOSE_TOP_UP_CREDITS_MODAL = 'CLOSE_TOP_UP_CREDITS_MODAL',
  SET_FOCUSED_PAYMENT_TX_HASH = 'SET_FOCUSED_PAYMENT_TX_HASH',
  CLEAR_FOCUSED_PAYMENT = 'CLEAR_FOCUSED_PAYMENT',
}

export type OpenTopUpCreditsModalAction = {
  type: UIActionType.OPEN_TOP_UP_CREDITS_MODAL
  payload: {
    minimumBalance?: number
  }
}

export type CloseTopUpCreditsModalAction = {
  type: UIActionType.CLOSE_TOP_UP_CREDITS_MODAL
  payload: undefined
}

export type SetFocusedPaymentTxHashAction = {
  type: UIActionType.SET_FOCUSED_PAYMENT_TX_HASH
  payload: {
    txHash: string
  }
}

export type ClearFocusedPaymentAction = {
  type: UIActionType.CLEAR_FOCUSED_PAYMENT
  payload: undefined
}

export type UIAction =
  | OpenTopUpCreditsModalAction
  | CloseTopUpCreditsModalAction
  | SetFocusedPaymentTxHashAction
  | ClearFocusedPaymentAction

export type UIReducer = StoreReducer<UIState, UIAction>

export function getUIReducer(): UIReducer {
  return (state = initialUIState, action) => {
    switch (action.type) {
      case UIActionType.OPEN_TOP_UP_CREDITS_MODAL: {
        return {
          ...state,
          isTopUpCreditsModalOpen: true,
          topUpCreditsMinimumBalance: action.payload.minimumBalance,
        }
      }

      case UIActionType.CLOSE_TOP_UP_CREDITS_MODAL: {
        return {
          ...state,
          isTopUpCreditsModalOpen: false,
          topUpCreditsMinimumBalance: undefined,
        }
      }

      case UIActionType.SET_FOCUSED_PAYMENT_TX_HASH: {
        return {
          ...state,
          focusedPaymentTxHash: action.payload.txHash,
        }
      }

      case UIActionType.CLEAR_FOCUSED_PAYMENT: {
        return {
          ...state,
          focusedPaymentTxHash: null,
        }
      }

      default: {
        return state
      }
    }
  }
}

// Action creators
export function openTopUpCreditsModal(
  minimumBalance?: number,
): OpenTopUpCreditsModalAction {
  return {
    type: UIActionType.OPEN_TOP_UP_CREDITS_MODAL,
    payload: {
      minimumBalance,
    },
  }
}

export function closeTopUpCreditsModal(): CloseTopUpCreditsModalAction {
  return {
    type: UIActionType.CLOSE_TOP_UP_CREDITS_MODAL,
    payload: undefined,
  }
}

export function setFocusedPaymentTxHash(
  txHash: string,
): SetFocusedPaymentTxHashAction {
  return {
    type: UIActionType.SET_FOCUSED_PAYMENT_TX_HASH,
    payload: {
      txHash,
    },
  }
}

export function clearFocusedPayment(): ClearFocusedPaymentAction {
  return {
    type: UIActionType.CLEAR_FOCUSED_PAYMENT,
    payload: undefined,
  }
}
