import { Account } from '@aleph-sdk/account'
import { ETHAccount } from '@aleph-sdk/ethereum'
import { isAccountSupported } from '@aleph-sdk/superfluid'

export const mockAccount = new ETHAccount(
  null as any,
  '0xcafecafecafecafecafecafecafecafecafecafe',
)

export function isAccountPAYGCompatible(account?: Account): boolean {
  return isAccountSupported(account)
}
