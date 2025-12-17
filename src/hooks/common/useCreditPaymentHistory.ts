import { useLocalRequest } from '@aleph-front/core'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import { CreditPaymentHistoryItem } from '@/domain/credit'

export type UseCreditPaymentHistoryReturn = {
  history: CreditPaymentHistoryItem[]
  loading: boolean
  error?: Error
}

export function useCreditPaymentHistory(): UseCreditPaymentHistoryReturn {
  const creditManager = useCreditManager()

  const {
    data: history = [],
    loading,
    error,
  } = useLocalRequest({
    doRequest: async (): Promise<CreditPaymentHistoryItem[]> => {
      if (!creditManager) {
        return []
      }

      return await creditManager.getPaymentHistory()
    },
    onSuccess: () => null,
    onError: () => null,
    flushData: true,
    triggerOnMount: true,
    triggerDeps: [creditManager],
  })

  return { history, loading, error }
}
