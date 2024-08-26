import { useAppState } from '@/contexts/appState'
import { useEffect, useState } from 'react'

export function useConfidentialsAuthorization(): boolean {
  const [state] = useAppState()
  const {
    connection: { account },
    manager: { voucherManager, confidentialManager },
    authorization: { confidentials },
  } = state

  const [accessConfidential, setAccessConfidential] =
    useState<boolean>(confidentials)

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!account || !voucherManager || !confidentialManager) {
        setAccessConfidential(false)
        return
      }

      const [vouchers, confidentials] = await Promise.all([
        voucherManager.getAll(),
        confidentialManager.getAll(),
      ])

      const hasVoucherAccess = vouchers
        .flatMap((v) => v.attributes)
        .some(
          (attr) =>
            attr.traitType === 'Confidential' && attr.value === 'Allowed',
        )

      const hasConfidentialsAccess = confidentials.length > 0

      setAccessConfidential(hasVoucherAccess || hasConfidentialsAccess)
    }
    checkAuthorization()
  }, [account, confidentialManager, voucherManager])

  return accessConfidential
}
