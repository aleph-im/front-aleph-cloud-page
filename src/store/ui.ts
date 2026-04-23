import { StoreReducer } from './store'
import { ReportIssueMetadata } from '@/components/modals/ReportIssueModal/types'

export type UIState = {
  isTopUpCreditsModalOpen: boolean
  topUpCreditsMinimumBalance?: number
  focusedPaymentId: string | null
  isPaymentStatusModalOpen: boolean
  isReportIssueModalOpen: boolean
  reportIssueMetadata?: ReportIssueMetadata
  isCreditTransferModalOpen: boolean
  isTransferStatusModalOpen: boolean
  transferStatusItemHash?: string
  creditDataRefreshTrigger: number
}

export const initialUIState: UIState = {
  isTopUpCreditsModalOpen: false,
  topUpCreditsMinimumBalance: undefined,
  focusedPaymentId: null,
  isPaymentStatusModalOpen: false,
  isReportIssueModalOpen: false,
  reportIssueMetadata: undefined,
  isCreditTransferModalOpen: false,
  isTransferStatusModalOpen: false,
  transferStatusItemHash: undefined,
  creditDataRefreshTrigger: 0,
}

export enum UIActionType {
  OPEN_TOP_UP_CREDITS_MODAL = 'OPEN_TOP_UP_CREDITS_MODAL',
  CLOSE_TOP_UP_CREDITS_MODAL = 'CLOSE_TOP_UP_CREDITS_MODAL',
  SET_FOCUSED_PAYMENT_ID = 'SET_FOCUSED_PAYMENT_ID',
  CLEAR_FOCUSED_PAYMENT = 'CLEAR_FOCUSED_PAYMENT',
  OPEN_PAYMENT_STATUS_MODAL = 'OPEN_PAYMENT_STATUS_MODAL',
  CLOSE_PAYMENT_STATUS_MODAL = 'CLOSE_PAYMENT_STATUS_MODAL',
  OPEN_REPORT_ISSUE_MODAL = 'OPEN_REPORT_ISSUE_MODAL',
  CLOSE_REPORT_ISSUE_MODAL = 'CLOSE_REPORT_ISSUE_MODAL',
  TRIGGER_CREDIT_DATA_REFRESH = 'TRIGGER_CREDIT_DATA_REFRESH',
  OPEN_CREDIT_TRANSFER_MODAL = 'OPEN_CREDIT_TRANSFER_MODAL',
  CLOSE_CREDIT_TRANSFER_MODAL = 'CLOSE_CREDIT_TRANSFER_MODAL',
  OPEN_TRANSFER_STATUS_MODAL = 'OPEN_TRANSFER_STATUS_MODAL',
  CLOSE_TRANSFER_STATUS_MODAL = 'CLOSE_TRANSFER_STATUS_MODAL',
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

export type SetFocusedPaymentIdAction = {
  type: UIActionType.SET_FOCUSED_PAYMENT_ID
  payload: {
    paymentId: string
  }
}

export type ClearFocusedPaymentAction = {
  type: UIActionType.CLEAR_FOCUSED_PAYMENT
  payload: undefined
}

export type OpenPaymentStatusModalAction = {
  type: UIActionType.OPEN_PAYMENT_STATUS_MODAL
  payload: undefined
}

export type ClosePaymentStatusModalAction = {
  type: UIActionType.CLOSE_PAYMENT_STATUS_MODAL
  payload: undefined
}

export type OpenReportIssueModalAction = {
  type: UIActionType.OPEN_REPORT_ISSUE_MODAL
  payload: {
    metadata?: ReportIssueMetadata
  }
}

export type CloseReportIssueModalAction = {
  type: UIActionType.CLOSE_REPORT_ISSUE_MODAL
  payload: undefined
}

export type TriggerCreditDataRefreshAction = {
  type: UIActionType.TRIGGER_CREDIT_DATA_REFRESH
  payload: undefined
}

export type OpenCreditTransferModalAction = {
  type: UIActionType.OPEN_CREDIT_TRANSFER_MODAL
  payload: undefined
}

export type CloseCreditTransferModalAction = {
  type: UIActionType.CLOSE_CREDIT_TRANSFER_MODAL
  payload: undefined
}

export type OpenTransferStatusModalAction = {
  type: UIActionType.OPEN_TRANSFER_STATUS_MODAL
  payload: {
    itemHash: string
  }
}

export type CloseTransferStatusModalAction = {
  type: UIActionType.CLOSE_TRANSFER_STATUS_MODAL
  payload: undefined
}

export type UIAction =
  | OpenTopUpCreditsModalAction
  | CloseTopUpCreditsModalAction
  | SetFocusedPaymentIdAction
  | ClearFocusedPaymentAction
  | OpenPaymentStatusModalAction
  | ClosePaymentStatusModalAction
  | OpenReportIssueModalAction
  | CloseReportIssueModalAction
  | TriggerCreditDataRefreshAction
  | OpenCreditTransferModalAction
  | CloseCreditTransferModalAction
  | OpenTransferStatusModalAction
  | CloseTransferStatusModalAction

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

      case UIActionType.SET_FOCUSED_PAYMENT_ID: {
        return {
          ...state,
          focusedPaymentId: action.payload.paymentId,
        }
      }

      case UIActionType.CLEAR_FOCUSED_PAYMENT: {
        return {
          ...state,
          focusedPaymentId: null,
        }
      }

      case UIActionType.OPEN_PAYMENT_STATUS_MODAL: {
        return {
          ...state,
          isPaymentStatusModalOpen: true,
        }
      }

      case UIActionType.CLOSE_PAYMENT_STATUS_MODAL: {
        return {
          ...state,
          isPaymentStatusModalOpen: false,
        }
      }

      case UIActionType.OPEN_REPORT_ISSUE_MODAL: {
        return {
          ...state,
          isReportIssueModalOpen: true,
          reportIssueMetadata: action.payload.metadata,
        }
      }

      case UIActionType.CLOSE_REPORT_ISSUE_MODAL: {
        return {
          ...state,
          isReportIssueModalOpen: false,
          reportIssueMetadata: undefined,
        }
      }

      case UIActionType.TRIGGER_CREDIT_DATA_REFRESH: {
        return {
          ...state,
          creditDataRefreshTrigger: state.creditDataRefreshTrigger + 1,
        }
      }

      case UIActionType.OPEN_CREDIT_TRANSFER_MODAL: {
        return {
          ...state,
          isCreditTransferModalOpen: true,
        }
      }

      case UIActionType.CLOSE_CREDIT_TRANSFER_MODAL: {
        return {
          ...state,
          isCreditTransferModalOpen: false,
        }
      }

      case UIActionType.OPEN_TRANSFER_STATUS_MODAL: {
        return {
          ...state,
          isTransferStatusModalOpen: true,
          transferStatusItemHash: action.payload.itemHash,
        }
      }

      case UIActionType.CLOSE_TRANSFER_STATUS_MODAL: {
        return {
          ...state,
          isTransferStatusModalOpen: false,
          transferStatusItemHash: undefined,
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

export function setFocusedPaymentId(
  paymentId: string,
): SetFocusedPaymentIdAction {
  return {
    type: UIActionType.SET_FOCUSED_PAYMENT_ID,
    payload: {
      paymentId,
    },
  }
}

export function clearFocusedPayment(): ClearFocusedPaymentAction {
  return {
    type: UIActionType.CLEAR_FOCUSED_PAYMENT,
    payload: undefined,
  }
}

export function openPaymentStatusModal(): OpenPaymentStatusModalAction {
  return {
    type: UIActionType.OPEN_PAYMENT_STATUS_MODAL,
    payload: undefined,
  }
}

export function closePaymentStatusModal(): ClosePaymentStatusModalAction {
  return {
    type: UIActionType.CLOSE_PAYMENT_STATUS_MODAL,
    payload: undefined,
  }
}

export function openReportIssueModal(
  metadata?: ReportIssueMetadata,
): OpenReportIssueModalAction {
  return {
    type: UIActionType.OPEN_REPORT_ISSUE_MODAL,
    payload: {
      metadata,
    },
  }
}

export function closeReportIssueModal(): CloseReportIssueModalAction {
  return {
    type: UIActionType.CLOSE_REPORT_ISSUE_MODAL,
    payload: undefined,
  }
}

export function triggerCreditDataRefresh(): TriggerCreditDataRefreshAction {
  return {
    type: UIActionType.TRIGGER_CREDIT_DATA_REFRESH,
    payload: undefined,
  }
}

export function openCreditTransferModal(): OpenCreditTransferModalAction {
  return {
    type: UIActionType.OPEN_CREDIT_TRANSFER_MODAL,
    payload: undefined,
  }
}

export function closeCreditTransferModal(): CloseCreditTransferModalAction {
  return {
    type: UIActionType.CLOSE_CREDIT_TRANSFER_MODAL,
    payload: undefined,
  }
}

export function openTransferStatusModal(
  itemHash: string,
): OpenTransferStatusModalAction {
  return {
    type: UIActionType.OPEN_TRANSFER_STATUS_MODAL,
    payload: { itemHash },
  }
}

export function closeTransferStatusModal(): CloseTransferStatusModalAction {
  return {
    type: UIActionType.CLOSE_TRANSFER_STATUS_MODAL,
    payload: undefined,
  }
}
