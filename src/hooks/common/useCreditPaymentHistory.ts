import { useCallback } from 'react'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import { CreditPaymentHistoryItem, PaymentStatus } from '@/domain/credit'
import { useAppStoreEntityRequest } from '@/hooks/common/useStoreEntitiesRequest'
import { useAppState } from '@/contexts/appState'

// TODO: Remove mock data after testing
const MOCK_PAYMENT_HISTORY: CreditPaymentHistoryItem[] = [
  {
    id: 'mock-payment-1',
    chain: 'ETH',
    status: PaymentStatus.Completed,
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    amount: 0.05,
    asset: 'ETH',
    credits: 150,
    bonus: 0,
    price: 3000,
    provider: 'WALLET',
    paymentMethod: 'crypto',
    txHash: '0xabc123mock1',
    itemHash: 'mock-item-hash-1',
  },
  {
    id: 'mock-payment-2',
    chain: 'BASE',
    status: PaymentStatus.Processing,
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    updatedAt: Date.now() - 1000 * 60 * 30,
    amount: 100,
    asset: 'USDC',
    credits: 100,
    bonus: 0,
    price: 1,
    provider: 'WALLET',
    paymentMethod: 'crypto',
    txHash: '0xabc123mock2',
    itemHash: 'mock-item-hash-2',
  },
  {
    id: 'mock-payment-3',
    chain: 'ETH',
    status: PaymentStatus.Failed,
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    amount: 0.1,
    asset: 'ETH',
    credits: 300,
    bonus: 0,
    price: 3000,
    provider: 'WALLET',
    paymentMethod: 'crypto',
    txHash: '0xabc123mock3',
    itemHash: 'mock-item-hash-3',
  },
  {
    id: 'mock-payment-4',
    chain: 'AVAX',
    status: PaymentStatus.Completed,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    amount: 50,
    asset: 'USDT',
    credits: 50,
    bonus: 5,
    price: 1,
    provider: 'WALLET',
    paymentMethod: 'crypto',
    txHash: '0xabc123mock4',
    itemHash: 'mock-item-hash-4',
  },
  {
    id: 'mock-payment-5',
    chain: 'ETH',
    status: PaymentStatus.Cancelled,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    amount: 0.02,
    asset: 'ETH',
    credits: 60,
    bonus: 0,
    price: 3000,
    provider: 'WALLET',
    paymentMethod: 'crypto',
    txHash: '0xabc123mock5',
    itemHash: 'mock-item-hash-5',
  },
  {
    id: 'mock-payment-6',
    chain: 'BASE',
    status: PaymentStatus.Completed,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14, // 2 weeks ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    amount: 200,
    asset: 'USDC',
    credits: 200,
    bonus: 20,
    price: 1,
    provider: 'WALLET',
    paymentMethod: 'crypto',
    txHash: '0xabc123mock6',
    itemHash: 'mock-item-hash-6',
  },
]

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
    // TODO: Remove mock data after testing
    if (account) {
      return MOCK_PAYMENT_HISTORY
    }

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
