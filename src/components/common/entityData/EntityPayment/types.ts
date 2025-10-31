import { Blockchain } from '@aleph-sdk/core'
import { PaymentType } from '@aleph-sdk/message'

// Base payment data interface
export interface BasePaymentData {
  cost?: number
  paymentType: PaymentType
  runningTime?: number // in seconds
  startTime?: number // timestamp in milliseconds
  blockchain?: Blockchain
  loading?: boolean
}

// Holding payment data (standard payment)
export interface HoldingPaymentData extends BasePaymentData {
  paymentType: PaymentType.hold
}

// Credit payment data (credit payment)
export interface CreditPaymentData extends BasePaymentData {
  paymentType: PaymentType.credit
}

// Stream payment data (pay-as-you-go)
export interface StreamPaymentData extends BasePaymentData {
  paymentType: PaymentType.superfluid
  receiver: string // Identifies the stream recipient
}

// Union type for all payment data types
export type PaymentData =
  | HoldingPaymentData
  | CreditPaymentData
  | StreamPaymentData

// Props for the EntityPayment component - just an array of payment data
export interface EntityPaymentProps {
  payments: PaymentData[]
}

// Formatted data returned by the hook for display
export interface FormattedPaymentData {
  isStream: boolean
  isCredit: boolean
  totalSpent?: string | number
  formattedBlockchain?: string
  formattedFlowRate?: string
  formattedStartDate?: string
  formattedDuration?: string
  loading: boolean
  receiverAddress?: string
  receiverType?: string // To display whether it's a node or community stream
  handleCopyReceiverAddress: () => void
}

export type UseEntityPaymentReturn = FormattedPaymentData
