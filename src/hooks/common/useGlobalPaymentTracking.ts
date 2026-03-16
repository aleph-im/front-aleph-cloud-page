import { useCallback } from 'react'
import { useNotification } from '@aleph-front/core'
import { usePaymentTracking } from '@/hooks/common/usePaymentTracking'
import { CreditPaymentHistoryItem } from '@/domain/credit'
import { formatCredits } from '@/helpers/utils'

export function useGlobalPaymentTracking() {
  const noti = useNotification()

  const handlePaymentCompleted = useCallback(
    (payment: CreditPaymentHistoryItem) => {
      noti?.add({
        variant: 'success',
        title: 'Purchase complete',
        text: `Your balance has been credited with ~${formatCredits(payment.credits)}.`,
      })
    },
    [noti],
  )

  return usePaymentTracking({ onPaymentCompleted: handlePaymentCompleted })
}
