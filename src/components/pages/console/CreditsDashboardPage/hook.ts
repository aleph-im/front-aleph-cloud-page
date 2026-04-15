import { useMemo } from 'react'
import { useConnection } from '@/hooks/common/useConnection'
import { useCreditPaymentHistory } from '@/hooks/common/useCreditPaymentHistory'
import { useTopUpCreditsModal } from '@/components/modals/TopUpCreditsModal/hook'
import { usePaymentStatusModal } from '@/components/modals/PaymentStatusModal/hook'
import { useCreditTransferModal } from '@/components/modals/CreditTransferModal/hook'
import { useServiceCosts } from '@/hooks/common/useServiceCosts'
import { UseCreditsDashboardPageReturn } from './types'

export function useCreditsDashboardPage(): UseCreditsDashboardPageReturn {
  const { account, creditBalance: accountCreditBalance } = useConnection({
    triggerOnMount: false,
  })

  const isConnected = useMemo(() => !!account, [account])

  // Costs data
  const {
    summary: costsSummary,
    resources: costsResources,
    loading: costsLoading,
  } = useServiceCosts()

  // Payment history (purchases)
  const { history: purchaseHistory, loading: purchaseHistoryLoading } =
    useCreditPaymentHistory()

  // Modals
  const { handleOpen: handleOpenTopUpModal } = useTopUpCreditsModal()
  const { handleOpen: handleOpenPaymentStatusModal } = usePaymentStatusModal()

  const { handleOpen: handleOpenTransferModal } = useCreditTransferModal()

  return {
    isConnected,
    accountCreditBalance,
    costsSummary,
    costsResources,
    costsLoading,
    purchaseHistory,
    purchaseHistoryLoading,
    handleOpenTopUpModal,
    handleOpenPaymentStatusModal,
    handleOpenTransferModal,
  }
}
