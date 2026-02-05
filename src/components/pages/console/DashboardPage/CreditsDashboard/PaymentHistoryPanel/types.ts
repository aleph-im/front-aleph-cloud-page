import { CreditPaymentHistoryItem } from '@/domain/credit'
import { ReportIssueMetadata } from '@/components/modals/ReportIssueModal/types'

export interface PaymentHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  payments: CreditPaymentHistoryItem[]
  loading: boolean
  onPaymentClick: (payment: CreditPaymentHistoryItem) => void
  onReportIssue: (metadata?: ReportIssueMetadata) => void
}
