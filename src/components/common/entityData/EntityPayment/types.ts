import { Blockchain } from '@aleph-sdk/core'
import { PaymentType } from '@aleph-sdk/message'
import { Instance } from '@/domain/instance'

export type EntityPaymentProps = {
  instance?: Instance
  paymentType?: PaymentType
}

export type UseEntityPaymentReturn = {
  cost?: number
  paymentType: PaymentType
  runningTime?: number // in seconds
  totalSpent?: number
  startTime?: number // timestamp in milliseconds
  blockchain?: Blockchain
  loading: boolean
}
