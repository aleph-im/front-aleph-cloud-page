import { useCallback } from 'react'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import { CreditPaymentHistoryItem } from '@/domain/credit'
import { useAppStoreEntityRequest } from '@/hooks/common/useStoreEntitiesRequest'
import { useAppState } from '@/contexts/appState'

export type UseCreditPaymentHistoryReturn = {
  history: CreditPaymentHistoryItem[]
  loading: boolean
  error?: Error
  refetch: () => void
}

export function useCreditPaymentHistory(): UseCreditPaymentHistoryReturn {
  const creditManager = useCreditManager()
  const [state] = useAppState()
  const { account } = state.connection

  const fetchPayments = useCallback(async (): Promise<
    CreditPaymentHistoryItem[]
  > => {
    if (!creditManager || !account) {
      return []
    }

    const payments = await creditManager.getPaymentHistory()
    return payments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [creditManager, account])

  const {
    data: history = [],
    loading,
    error,
    request,
  } = useAppStoreEntityRequest<CreditPaymentHistoryItem>({
    name: 'creditPayment',
    doRequest: fetchPayments,
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: !!account,
    triggerDeps: [creditManager, account],
    cacheStrategy: 'overwrite',
  })

  return {
    history,
    loading,
    error,
    refetch: request,
  }
}
