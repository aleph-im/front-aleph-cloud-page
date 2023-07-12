import { DomainProp } from '@/hooks/form/useAddDomains'

export type DomainItemProps = {
  domain: DomainProp
  onChange: (domain: DomainProp) => void
  onRemove: (domainId: string) => void
}

export type AddDomainsProps = {
  domains?: DomainProp[]
  onChange: (domains: DomainProp[]) => void
}
