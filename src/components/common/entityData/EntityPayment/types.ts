import { Blockchain } from '@aleph-sdk/core'
import { PaymentType } from '@aleph-sdk/message'

export type EntityPaymentProps = {
  cost?: number
  paymentType: PaymentType
  runningTime?: number // in seconds
  totalSpent?: number
  startTime?: number // timestamp in milliseconds
  blockchain?: Blockchain
}
