import { Blockchain } from '@aleph-sdk/core'
import { PaymentType } from '@aleph-sdk/message'

// Props for the EntityPayment component - raw data to be formatted by the hook
export type EntityPaymentProps = {
  cost?: number
  paymentType: PaymentType
  runningTime?: number // in seconds
  startTime?: number // timestamp in milliseconds
  blockchain?: Blockchain
  loading?: boolean
}

// Formatted data returned by the hook for display
export type FormattedPaymentData = {
  isPAYG: boolean
  totalSpent: string
  formattedBlockchain: string
  formattedFlowRate: string
  formattedStartDate: string
  formattedDuration: string
  loading: boolean
}

export type UseEntityPaymentReturn = FormattedPaymentData
