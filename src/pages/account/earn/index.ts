import { useRedirect } from '@/hooks/common/useRedirect'
import { memo } from 'react'

export function AccountEarnHomePage() {
  useRedirect('/account/earn/staking')
  return null
}

export default memo(AccountEarnHomePage)
