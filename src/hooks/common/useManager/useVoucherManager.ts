import { useAppState } from '@/contexts/appState'
import { VoucherManager } from '@/domain/voucher'

export function useVoucherManager(): VoucherManager | undefined {
  const [appState] = useAppState()
  const { voucherManager } = appState.manager

  return voucherManager
}
