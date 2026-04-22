import { CreditPaymentHistoryItem } from '@/domain/credit'

export type RecentPurchasesProps = {
  isConnected: boolean
  purchaseHistory: CreditPaymentHistoryItem[]
  purchaseHistoryLoading: boolean
  handleOpenTopUpModal: (minimumBalance?: number) => void
  handleOpenPaymentStatusModal: (payment: CreditPaymentHistoryItem) => void
}
