import { useCallback, useEffect, useRef } from 'react'
import { useAppState } from '@/contexts/appState'
import {
  openPaymentStatusModal,
  closePaymentStatusModal,
  clearFocusedPayment,
  setFocusedPaymentId,
} from '@/store/ui'
import { useCreditPaymentHistory } from '@/hooks/common/useCreditPaymentHistory'
import { CreditPaymentHistoryItem } from '@/domain/credit'

export type UsePaymentStatusModalReturn = {
  isOpen: boolean
  displayedPayment: CreditPaymentHistoryItem | null
  handleOpen: (payment: CreditPaymentHistoryItem) => void
  handleClose: () => void
}

export function usePaymentStatusModal(): UsePaymentStatusModalReturn {
  const [appState, dispatch] = useAppState()
  const { focusedPaymentId, isPaymentStatusModalOpen } = appState.ui

  const { history } = useCreditPaymentHistory()

  const focusedPayment = focusedPaymentId
    ? (history.find((p) => p.id === focusedPaymentId) ?? null)
    : null

  const prevFocusedPaymentRef = useRef<CreditPaymentHistoryItem | null>(null)

  // Auto-open modal when focusedPayment first appears in history
  useEffect(() => {
    if (focusedPayment && !prevFocusedPaymentRef.current) {
      dispatch(openPaymentStatusModal())
    }
    prevFocusedPaymentRef.current = focusedPayment
  }, [focusedPayment, dispatch])

  const handleClose = useCallback(() => {
    dispatch(closePaymentStatusModal())
    setTimeout(() => {
      dispatch(clearFocusedPayment())
    }, 500)
  }, [dispatch])

  const handleOpen = useCallback(
    (payment: CreditPaymentHistoryItem) => {
      dispatch(setFocusedPaymentId(payment.id))
      dispatch(openPaymentStatusModal())
    },
    [dispatch],
  )

  const displayedPayment = focusedPayment

  return {
    isOpen: isPaymentStatusModalOpen,
    displayedPayment,
    handleOpen,
    handleClose,
  }
}
