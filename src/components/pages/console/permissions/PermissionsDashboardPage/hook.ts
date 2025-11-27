import { AccountPermissions } from '@/domain/permissions'
import { useRequestPermissions } from '@/hooks/common/useRequestEntity/useRequestPermissions'

export type UsePermissionsDashboardPageReturn = {
  permissions: AccountPermissions[]
}

export function usePermissionsDashboardPage(): UsePermissionsDashboardPageReturn {
  const { entities: permissions = [] } = useRequestPermissions()

  return {
    permissions,
  }
}
