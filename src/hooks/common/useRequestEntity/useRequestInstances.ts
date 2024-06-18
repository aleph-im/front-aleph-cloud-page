import { Instance } from '@/domain/instance'
import { useInstanceManager } from '../useManager/useInstanceManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestInstancesProps = Omit<
  UseRequestEntitiesProps<Instance>,
  'name'
>

export type UseRequestInstancesReturn = UseRequestEntitiesReturn<Instance>

export function useRequestInstances(
  props: UseRequestInstancesProps = {},
): UseRequestInstancesReturn {
  const manager = useInstanceManager()
  return useRequestEntities({ ...props, manager, name: 'instance' })
}
