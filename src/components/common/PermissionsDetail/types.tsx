import { AccountPermissions } from '@/domain/permissions'

export type PermissionsDetailProps = {
  permissions: AccountPermissions
  renderFooter?: (handleSubmit: () => void) => React.ReactNode
  onDirtyChange?: (isDirty: boolean) => void
}
