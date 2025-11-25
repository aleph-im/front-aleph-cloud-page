import { Permission } from '@/domain/permissions'

export type PermissionsTabContentProps = {
  data: Permission[]
}

export type PermissionsTableColumnsProps = {
  onRowConfigure: (row: Permission) => void
  onRowRevoke: (row: Permission) => void
}
