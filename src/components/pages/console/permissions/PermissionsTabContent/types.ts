import { AccountPermissions } from '@/domain/permissions'

export type PermissionsTabContentProps = {
  data: AccountPermissions[]
  onPermissionChange?: (updatedPermission: AccountPermissions) => void
}

export type PermissionsTableColumnsProps = {
  onRowConfigure: (row: AccountPermissions) => void
  onRowRevoke: (row: AccountPermissions) => void
}
