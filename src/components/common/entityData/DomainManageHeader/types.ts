import { Domain, DomainStatus } from '@/domain/domain'

export type DomainManageHeaderProps = {
  domain?: Domain
  name: string
  status?: DomainStatus

  // Update action
  updateDisabled?: boolean
  updateLoading?: boolean
  onUpdate: () => void

  // Delete action
  deleteDisabled?: boolean
  deleteLoading?: boolean
  onDelete: () => void

  // Go back action
  onBack: () => void
}
