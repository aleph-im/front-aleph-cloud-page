import { useEffect, useState, useMemo, Dispatch, SetStateAction } from 'react'
import { useConnection } from '@/hooks/common/useConnection'
import { useServiceCosts } from '@/hooks/common/useServiceCosts'
import { useCreditPaymentHistory } from '@/hooks/common/useCreditPaymentHistory'
import { useTopUpCreditsModal } from '@/components/modals/TopUpCreditsModal/hook'
import { usePaymentStatusModal } from '@/components/modals/PaymentStatusModal/hook'
import { CreditPaymentHistoryItem } from '@/domain/credit'

export type UseCreditsDashboardReturn = {
  // Balance & costs
  runRateDays: number
  runRate: {
    totalHours: number
    years: number
    months: number
    days: number
    hours: number
  } | null
  costsLoading: boolean
  accountCreditBalance?: number

  // Connection
  isConnected: boolean

  // Dashboard toggle
  creditsDashboardOpen: boolean
  setCreditsDashboardOpen: Dispatch<SetStateAction<boolean>>

  // Payment history
  history: CreditPaymentHistoryItem[]
  historyLoading: boolean
  recentHistory: CreditPaymentHistoryItem[]

  // History panel
  isHistoryPanelOpen: boolean
  setIsHistoryPanelOpen: Dispatch<SetStateAction<boolean>>

  // Payment status modal
  handleOpenPaymentStatusModal: (payment: CreditPaymentHistoryItem) => void

  // Top-up modal
  handleOpenTopUpModal: (minimumBalance?: number) => void
}

export function useCreditsDashboard(): UseCreditsDashboardReturn {
  const [creditsDashboardOpen, setCreditsDashboardOpen] = useState(false)

  const { account, creditBalance: accountCreditBalance } = useConnection({
    triggerOnMount: false,
  })

  const isConnected = useMemo(() => !!account, [account])

  // Payment history
  const { history, loading: historyLoading } = useCreditPaymentHistory()
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false)

  // Top-up modal
  const { handleOpen: handleOpenTopUpModal } = useTopUpCreditsModal()

  // Payment status modal
  const { handleOpen: handleOpenPaymentStatusModal } = usePaymentStatusModal()

  // Show only latest 5 payments in dashboard
  const recentHistory = useMemo(() => history.slice(0, 5), [history])

  // Use /costs API for run rate calculation
  const { summary: costsSummary, loading: costsLoading } = useServiceCosts()

  const runRate = useMemo(() => {
    if (!accountCreditBalance || accountCreditBalance <= 0 || !costsSummary) {
      return null
    }

    // total_cost_credit is credits per second
    const perSecond = parseFloat(costsSummary.total_cost_credit)
    if (perSecond <= 0) return null

    const costPerHour = perSecond * 3600
    const totalHours = accountCreditBalance / costPerHour
    const years = Math.floor(totalHours / (24 * 365))
    const months = Math.floor((totalHours % (24 * 365)) / (24 * 30))
    const days = Math.floor((totalHours % (24 * 30)) / 24)
    const hours = Math.floor(totalHours % 24)

    return { totalHours, years, months, days, hours }
  }, [accountCreditBalance, costsSummary])

  const runRateDays = runRate ? Math.floor(runRate.totalHours / 24) : 0

  // Handle dashboard open/close based on connection
  useEffect(() => {
    if (!isConnected && creditsDashboardOpen) {
      setCreditsDashboardOpen(false)
    }
  }, [isConnected, creditsDashboardOpen])

  return {
    // Balance & costs
    runRateDays,
    runRate,
    costsLoading,
    accountCreditBalance,

    // Connection
    isConnected,

    // Dashboard toggle
    creditsDashboardOpen,
    setCreditsDashboardOpen,

    // Payment history
    history,
    historyLoading,
    recentHistory,

    // History panel
    isHistoryPanelOpen,
    setIsHistoryPanelOpen,

    // Payment status modal
    handleOpenPaymentStatusModal,

    // Top-up modal
    handleOpenTopUpModal,
  }
}
