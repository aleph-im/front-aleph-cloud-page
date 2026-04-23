import { useCallback } from 'react'
import { useNotification } from '@aleph-front/core'
import { usePaymentTracking } from '@/hooks/common/usePaymentTracking'
import { CreditPaymentHistoryItem } from '@/domain/credit'
import { formatCredits } from '@/helpers/utils'
import { useAppState } from '@/contexts/appState'
import { triggerCreditDataRefresh } from '@/store/ui'

export function useGlobalPaymentTracking() {
  const noti = useNotification()
  const [, dispatch] = useAppState()

  const handlePaymentCompleted = useCallback(
    (payment: CreditPaymentHistoryItem) => {
      noti?.add({
        variant: 'success',
        title: 'Purchase complete',
        text:
          payment.credits !== null
            ? `Your balance has been credited with ~${formatCredits(payment.credits)}.`
            : 'Your balance has been credited.',
      })

      // Refresh all credit-related data (history, costs, etc.)
      dispatch(triggerCreditDataRefresh())
    },
    [noti, dispatch],
  )

  return usePaymentTracking({ onPaymentCompleted: handlePaymentCompleted })
}
