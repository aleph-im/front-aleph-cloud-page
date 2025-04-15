import { useAppState } from '@/contexts/appState'
import { Voucher } from '@/domain/voucher'
import { useLocalRequest } from '@aleph-front/core'

export type UseAccountVouchersReturn = {
  vouchers: Voucher[]
  loading: boolean
  error?: Error
}

export function useAccountVouchers(): UseAccountVouchersReturn {
  const [state] = useAppState()
  const {
    manager: { voucherManager },
  } = state

  const {
    data: vouchers = [],
    loading,
    error,
  } = useLocalRequest({
    doRequest: () => {
      return voucherManager
        ? voucherManager.getAll()
        : Promise.resolve<Voucher[]>([])
    },
    onSuccess: () => null,
    onError: () => null,
    flushData: true,
    triggerOnMount: true,
    triggerDeps: [voucherManager],
  })

  return { vouchers, loading, error }
}
