import { Domain, DomainStatus } from '@/domain/domain'

export type DomainWithStatus = Domain & {
  status?: DomainStatus
}

export type EntityCustomDomainsProps = {
  isLoadingCustomDomains: boolean
  customDomains: DomainWithStatus[]
  onCustomDomainClick: (customDomain: Domain) => void
}
