import { CreditPaymentHistoryItem } from '@/domain/credit'

export interface PaymentStatusModalProps {
  payment: CreditPaymentHistoryItem
  onClose?: () => void
}
