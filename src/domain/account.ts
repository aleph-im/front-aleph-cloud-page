import { Account } from '@aleph-sdk/account'
import { isAccountSupported } from '@aleph-sdk/superfluid'

export function isAccountPAYGCompatible(account?: Account): boolean {
  return isAccountSupported(account)
}
