import { useRedirect } from '@/hooks/common/useRedirect'
import { memo } from 'react'
import { NAVIGATION_URLS } from '@/helpers/constants'

export function AccountHomePage() {
  useRedirect(NAVIGATION_URLS.account.earn.staking)
  return null
}

export default memo(AccountHomePage)
