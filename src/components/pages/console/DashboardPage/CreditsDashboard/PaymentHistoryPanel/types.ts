import { CreditPaymentHistoryItem } from '@/domain/credit'

export interface PaymentHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  payments: CreditPaymentHistoryItem[]
  loading: boolean
  onPaymentClick: (payment: CreditPaymentHistoryItem) => void
}
