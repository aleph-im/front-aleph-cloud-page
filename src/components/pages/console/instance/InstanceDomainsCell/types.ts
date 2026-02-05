import { Domain } from '@/domain/domain'

export type InstanceDomainsCellProps = {
  domains: Domain[]
  onDomainClick: (domain: Domain) => void
}
