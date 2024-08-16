import { useAppState } from '@/contexts/appState'
import { useMemo, useState } from 'react'

const CONFIDENTIAL_VOUCHER_METADATA_ID = '3'

export function useConfidentialsAuthorization(): boolean {
  const [state] = useAppState()
  const {
    connection: { account },
    manager: { voucherManager },
    authorization: { confidentials },
  } = state
  const [accessConfidential, setAccessConfidential] = useState(confidentials)

  useMemo(async () => {
    if (!account) return setAccessConfidential(false)
    if (!voucherManager) return setAccessConfidential(false)

    const vouchers = await voucherManager.getAll()

    if (vouchers.some((v) => v.metadataId === CONFIDENTIAL_VOUCHER_METADATA_ID))
      setAccessConfidential(true)
  }, [account, voucherManager])

  return accessConfidential
}
