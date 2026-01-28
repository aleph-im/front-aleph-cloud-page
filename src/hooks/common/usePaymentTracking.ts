import { useCallback, useEffect, useMemo, useRef } from 'react'
import { CreditPaymentHistoryItem, PaymentStatus } from '@/domain/credit'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import { usePollingUntil } from '@/hooks/common/usePollingUntil'
import { useRefreshBalance } from '@/hooks/common/useRefreshBalance'
import { useAppState } from '@/contexts/appState'
import { EntitySuccessAction } from '@/store/entity'

export type UsePaymentTrackingProps = {
  onPaymentUpdated?: (payment: CreditPaymentHistoryItem) => void
  onPaymentCompleted?: (payment: CreditPaymentHistoryItem) => void
}

export type UsePaymentTrackingReturn = {
  pendingPayments: CreditPaymentHistoryItem[]
  isTracking: boolean
}

export function usePaymentTracking({
  onPaymentUpdated,
  onPaymentCompleted,
}: UsePaymentTrackingProps = {}): UsePaymentTrackingReturn {
  const creditManager = useCreditManager()
  const { refreshBalance } = useRefreshBalance()
  const [state, dispatch] = useAppState()

  const storePayments = useMemo(
    () => state.creditPayment.entities || [],
    [state.creditPayment.entities],
  )

  // Refs to access latest callbacks without re-triggering effects
  const onPaymentUpdatedRef = useRef(onPaymentUpdated)
  const onPaymentCompletedRef = useRef(onPaymentCompleted)

  useEffect(() => {
    onPaymentUpdatedRef.current = onPaymentUpdated
  }, [onPaymentUpdated])

  useEffect(() => {
    onPaymentCompletedRef.current = onPaymentCompleted
  }, [onPaymentCompleted])

  // Track payment statuses to detect changes
  const paymentStatusesRef = useRef<Map<string, PaymentStatus>>(new Map())

  // Final states that don't need tracking
  const isFinalStatus = useCallback((status: PaymentStatus) => {
    return (
      status === PaymentStatus.Completed ||
      status === PaymentStatus.Failed ||
      status === PaymentStatus.Cancelled
    )
  }, [])

  // Get incomplete payments from store
  const pendingPayments = useMemo(() => {
    return storePayments.filter((p) => !isFinalStatus(p.status))
  }, [storePayments, isFinalStatus])

  // Check if there are any incomplete payments
  const hasIncompletePayments = pendingPayments.length > 0

  const fetchHistory = useCallback(async () => {
    if (!creditManager) return []
    return creditManager.getPaymentHistory()
  }, [creditManager])

  // Process history data to update store and trigger callbacks
  const handleHistoryData = useCallback(
    (payments: CreditPaymentHistoryItem[]) => {
      // Sort by createdAt descending
      const sortedPayments = [...payments].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
      )

      // Update store with latest payments
      dispatch(
        new EntitySuccessAction({
          name: 'creditPayment',
          entities: sortedPayments,
        }),
      )

      // Check for status changes on incomplete payments
      for (const payment of sortedPayments) {
        if (!payment.txHash) continue

        const prevStatus = paymentStatusesRef.current.get(payment.txHash)

        // Track new payment status
        if (prevStatus === undefined) {
          paymentStatusesRef.current.set(payment.txHash, payment.status)
          continue
        }

        // Check for status changes
        if (payment.status !== prevStatus) {
          paymentStatusesRef.current.set(payment.txHash, payment.status)
          onPaymentUpdatedRef.current?.(payment)

          if (payment.status === PaymentStatus.Completed) {
            refreshBalance()
            onPaymentCompletedRef.current?.(payment)
          }
        }
      }
    },
    [dispatch, refreshBalance],
  )

  // Condition: all payments are in a final state
  const checkAllCompleted = useCallback(
    (payments: CreditPaymentHistoryItem[]) => {
      return payments.every((p) => isFinalStatus(p.status))
    },
    [isFinalStatus],
  )

  // Try for an hour in intervals of 5 secs
  const { isPolling } = usePollingUntil({
    fetchFn: fetchHistory,
    conditionFn: checkAllCompleted,
    enabled: hasIncompletePayments,
    interval: 5000,
    maxAttempts: 720,
    onData: handleHistoryData,
  })

  return {
    pendingPayments,
    isTracking: isPolling,
  }
}
