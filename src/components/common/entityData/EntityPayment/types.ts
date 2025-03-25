import { Blockchain } from '@aleph-sdk/core'
import { PaymentType } from '@aleph-sdk/message'
import { Instance } from '@/domain/instance'

export type EntityPaymentProps = {
  instance?: Instance
  paymentType?: PaymentType
}

// Raw data returned from the hook
export type PaymentData = {
  cost?: number
  paymentType: PaymentType
  runningTime?: number // in seconds
  totalSpent?: number
  startTime?: number // timestamp in milliseconds
  blockchain?: Blockchain
  loading: boolean
}

// Formatted data for display
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
