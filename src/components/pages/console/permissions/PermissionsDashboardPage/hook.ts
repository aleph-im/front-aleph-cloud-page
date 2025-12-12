import { AccountPermissions, PermissionsManager } from '@/domain/permissions'
import { usePermissionsManager } from '@/hooks/common/useManager/usePermissionManager'
import { useRequestPermissions } from '@/hooks/common/useRequestEntity/useRequestPermissions'

export type UsePermissionsDashboardPageReturn = {
  permissions: AccountPermissions[]
  manager: PermissionsManager | undefined
}

export function usePermissionsDashboardPage(): UsePermissionsDashboardPageReturn {
  const { entities: permissions = [] } = useRequestPermissions()
  const manager = usePermissionsManager()

  return {
    permissions,
    manager,
  }
}
