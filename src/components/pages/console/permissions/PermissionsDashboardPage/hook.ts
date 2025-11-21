import { useRequestPermissions } from '@/hooks/common/useRequestEntity/useRequestPermissions'
import { Permission } from '@/domain/permissions'

export type UsePermissionsDashboardPageReturn = {
  permissions: Permission[]
}

export function usePermissionsDashboardPage(): UsePermissionsDashboardPageReturn {
  const { entities: permissions = [] } = useRequestPermissions()

  console.log('permissions', permissions)
  return {
    permissions,
  }
}
