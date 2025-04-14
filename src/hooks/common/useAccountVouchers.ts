import { useAppState } from '@/contexts/appState'
import { Voucher } from '@/domain/voucher'
import { useEffect, useState } from 'react'

export type UseAccountVouchersReturn = {
  vouchers: Voucher[]
  loading: boolean
}

export function useAccountVouchers(): UseAccountVouchersReturn {
  const [state] = useAppState()
  const {
    manager: { voucherManager },
  } = state

  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVouchers() {
      setLoading(true)

      if (!voucherManager) return

      try {
        const fetchedVouchers = await voucherManager.getAll()
        setVouchers(fetchedVouchers)
      } catch (error) {
        console.error('Error fetching vouchers:', error)
        setVouchers([])
      } finally {
        setLoading(false)
      }
    }

    fetchVouchers()
  }, [voucherManager])

  return { vouchers, loading }
}
