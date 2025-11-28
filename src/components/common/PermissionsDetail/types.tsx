import { AccountPermissions } from '@/domain/permissions'

export type PermissionsDetailProps = {
  permissions: AccountPermissions
  onDirtyChange?: (isDirty: boolean) => void
  onSubmitSuccess?: (updatedPermission: AccountPermissions) => void
  onOpenChannelsPanel?: () => void
}
