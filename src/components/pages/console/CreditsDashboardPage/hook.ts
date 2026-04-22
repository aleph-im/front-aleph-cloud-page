import { useMemo } from 'react'
import { useConnection } from '@/hooks/common/useConnection'
import { useCreditPaymentHistory } from '@/hooks/common/useCreditPaymentHistory'
import { useTopUpCreditsModal } from '@/components/modals/TopUpCreditsModal/hook'
import { usePaymentStatusModal } from '@/components/modals/PaymentStatusModal/hook'
import { useCreditTransferModal } from '@/components/modals/CreditTransferModal/hook'
import { useServiceCosts } from '@/hooks/common/useServiceCosts'
import { useAppState } from '@/contexts/appState'
import { UseCreditsDashboardPageReturn } from './types'

export function useCreditsDashboardPage(): UseCreditsDashboardPageReturn {
  const { account, creditBalance: accountCreditBalance } = useConnection({
    triggerOnMount: false,
  })

  const [state] = useAppState()
  const crnNodes =
    state.crns && 'entities' in state.crns ? state.crns.entities : undefined

  const isConnected = useMemo(() => !!account, [account])

  const knownCrnHashes = useMemo(() => {
    const set = new Set<string>()
    if (crnNodes) {
      crnNodes.forEach((node) => set.add(node.hash))
    }
    return set
  }, [crnNodes])

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
    accountAddress: account?.address,
    accountCreditBalance,
    knownCrnHashes,
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
