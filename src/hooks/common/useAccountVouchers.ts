import { Voucher } from '@/domain/voucher'
import { useLocalRequest } from '@aleph-front/core'
import { useVoucherManager } from './useManager/useVoucherManager'

export type UseAccountVouchersReturn = {
  vouchers: Voucher[]
  loading: boolean
  error?: Error
}

export function useAccountVouchers(): UseAccountVouchersReturn {
  const voucherManager = useVoucherManager()

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
