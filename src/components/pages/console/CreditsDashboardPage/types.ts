import { CostsSummary, CostsResource } from '@/hooks/common/useServiceCosts'
import { CreditPaymentHistoryItem } from '@/domain/credit'

export type UseCreditsDashboardPageReturn = {
  // Connection
  isConnected: boolean
  accountCreditBalance?: number

  // Costs
  costsSummary?: CostsSummary
  costsResources: CostsResource[]
  costsLoading: boolean

  // Payment history (purchases)
  purchaseHistory: CreditPaymentHistoryItem[]
  purchaseHistoryLoading: boolean

  // Modals
  handleOpenTopUpModal: (minimumBalance?: number) => void
  handleOpenPaymentStatusModal: (payment: CreditPaymentHistoryItem) => void
  handleOpenTransferModal: () => void
}
