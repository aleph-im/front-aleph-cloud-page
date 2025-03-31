import { Blockchain } from '@aleph-sdk/core'
import { PaymentType } from '@aleph-sdk/message'

// Single payment data item - raw data to be formatted by the hook
export type EntityPaymentData = {
  cost?: number
  paymentType: PaymentType
  runningTime?: number // in seconds
  startTime?: number // timestamp in milliseconds
  blockchain?: Blockchain
  loading?: boolean
  receiver?: string // Optional: to identify different streams in PAYG instances
}

// Props for the EntityPayment component
export type EntityPaymentProps = EntityPaymentData & {
  streams?: EntityPaymentData[] // Optional array of stream payments
}

// Formatted data returned by the hook for display
export type FormattedPaymentData = {
  isPAYG: boolean
  totalSpent?: string
  formattedBlockchain?: string
  formattedFlowRate?: string
  formattedStartDate?: string
  formattedDuration?: string
  loading: boolean
  receiverType?: string // To display whether it's a node or community stream
}

export type UseEntityPaymentReturn = FormattedPaymentData
