export type EntityPaymentProps = {
  cost?: number
  paymentType?: 'holding' | 'stream'
  costPerHour?: number
  runningTime?: number // in seconds
  totalSpent?: number
  startTime?: number // timestamp in milliseconds
}
