import { AccountPermissions } from '@/domain/permissions'

export type PermissionsDetailProps = {
  permissions: AccountPermissions
  onSubmit?: (updatedPermission: AccountPermissions) => void
  onUpdate?: (updatedPermission: AccountPermissions) => void
  channelsPanelOrder?: number
  onCancel?: () => void
}
