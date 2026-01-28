import { CreditPaymentHistoryItem } from '@/domain/credit'

export interface PaymentStatusModalContentProps {
  payment: CreditPaymentHistoryItem
}

export interface PaymentStatusModalHeaderProps {
  payment: CreditPaymentHistoryItem
}

export interface PaymentStatusModalFooterProps {
  payment: CreditPaymentHistoryItem
  onClose?: () => void
}
