import { Domain, DomainStatus } from '@/domain/domain'
import { Account } from '@aleph-sdk/account'

export type DomainDnsConfigurationProps = {
  domain?: Domain
  status?: DomainStatus
  account?: Account
  onRetry: () => void
}
