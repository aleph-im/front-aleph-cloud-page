import { Permission } from '@/domain/permissions'
import { usePermissionsManager } from '../useManager/usePermissionManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestPermissionsProps = Omit<
  UseRequestEntitiesProps<Permission>,
  'name'
>

export type UseRequestPermissionsReturn = UseRequestEntitiesReturn<Permission>

export function useRequestPermissions(
  props: UseRequestPermissionsProps = {},
): UseRequestPermissionsReturn {
  const manager = usePermissionsManager()
  return useRequestEntities({ ...props, manager, name: 'permissions' })
}
