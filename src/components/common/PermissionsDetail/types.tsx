import { AccountPermissions } from '@/domain/permissions'

export type PermissionsDetailProps = {
  permissions: AccountPermissions
  onDirtyChange?: (isDirty: boolean) => void
  onUpdate?: (updatedPermission: AccountPermissions) => void
  onOpenChannelsPanel?: () => void
}
