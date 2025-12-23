import { AccountPermissions } from '@/domain/permissions'
import { usePermissionsManager } from '../useManager/usePermissionManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestPermissionsProps = Omit<
  UseRequestEntitiesProps<AccountPermissions>,
  'name'
>

export type UseRequestPermissionsReturn =
  UseRequestEntitiesReturn<AccountPermissions>

export function useRequestPermissions(
  props: UseRequestPermissionsProps = {},
): UseRequestPermissionsReturn {
  const manager = usePermissionsManager()
  return useRequestEntities({ ...props, manager, name: 'permissions' })
}
