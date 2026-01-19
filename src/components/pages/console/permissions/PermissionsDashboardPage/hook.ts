import { AccountPermissions, PermissionsManager } from '@/domain/permissions'
import { usePermissionsManager } from '@/hooks/common/useManager/usePermissionManager'
import { useRequestPermissions } from '@/hooks/common/useRequestEntity/useRequestPermissions'

export type UsePermissionsDashboardPageReturn = {
  permissions: AccountPermissions[]
  manager: PermissionsManager | undefined
  refetchPermissions: () => Promise<void>
}

export function usePermissionsDashboardPage(): UsePermissionsDashboardPageReturn {
  const { entities: permissions = [], refetch: refetchPermissions } =
    useRequestPermissions()
  const manager = usePermissionsManager()

  return {
    permissions,
    manager,
    refetchPermissions,
  }
}
