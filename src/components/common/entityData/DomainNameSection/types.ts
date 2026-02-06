import { Domain, DomainStatus } from '@/domain/domain'

export type DomainNameSectionProps = {
  domain?: Domain
  status?: DomainStatus
  onSave?: (newName: string) => Promise<void>
  onConfigure?: () => void
  hideTitle?: boolean
}
