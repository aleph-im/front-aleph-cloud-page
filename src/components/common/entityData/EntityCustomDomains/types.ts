import { Domain, DomainStatus } from '@/domain/domain'
import { EntityDomainType } from '@/helpers/constants'

export type DomainWithStatus = Domain & {
  status?: DomainStatus
}

export type EntityCustomDomainsProps = {
  entityId?: string
  entityType?: EntityDomainType
  isLoadingCustomDomains: boolean
  customDomains: DomainWithStatus[]
  onCustomDomainClick: (customDomain: Domain) => void
}
