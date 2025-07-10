import { Domain, DomainStatus } from '@/domain/domain'

export type DomainWithStatus = Domain & {
  status?: DomainStatus
}

export type EntityCustomDomainsProps = {
  customDomains: DomainWithStatus[]
  onCustomDomainClick: (customDomain: Domain) => void
}
