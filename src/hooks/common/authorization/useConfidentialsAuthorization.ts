import { useAppState } from '@/contexts/appState'
import { useMemo, useState } from 'react'

export function useConfidentialsAuthorization(): boolean {
  const [state] = useAppState()
  const {
    connection: { account },
    manager: { voucherManager, confidentialManager },
    authorization: { confidentials },
  } = state
  const [accessConfidential, setAccessConfidential] = useState(confidentials)

  useMemo(async () => {
    if (!account) return setAccessConfidential(false)
    if (!voucherManager) return setAccessConfidential(false)

    const vouchers = await voucherManager.getAll()

    if (
      vouchers
        .flatMap((v) => v.attributes)
        .some(
          (attr) =>
            attr.traitType === 'Confidential' && attr.value === 'Allowed',
        )
    )
      setAccessConfidential(true)
  }, [account, voucherManager])

  useMemo(async () => {
    if (!account) return setAccessConfidential(false)
    if (!confidentialManager) return setAccessConfidential(false)

    const confidentials = await confidentialManager.getAll()

    if (confidentials.length) setAccessConfidential(true)
  }, [account, confidentialManager])

  return accessConfidential
}
