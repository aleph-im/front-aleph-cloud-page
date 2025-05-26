import { Domain, DomainStatus } from '@/domain/domain'

export type DomainWithStatus = {
  domain: Domain
  status?: DomainStatus
}

export type EntityCustomDomainsProps = {
  customDomains: DomainWithStatus[]
  onCustomDomainClick: (customDomain: Domain) => void
}
