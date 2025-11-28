import { AccountPermissions } from '@/domain/permissions'

export type PermissionsDetailProps = {
  permissions: AccountPermissions
  onUpdate?: (updatedPermission: AccountPermissions) => void
  onOpenChannelsPanel?: () => void
}
