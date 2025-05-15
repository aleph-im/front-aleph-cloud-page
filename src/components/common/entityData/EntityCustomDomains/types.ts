import { Domain } from '@/domain/domain'

export type EntityCustomDomainsProps = {
  customDomains: (Domain | undefined)[]
  onCustomDomainClick: (customDomain: Domain) => void
}
