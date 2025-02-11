import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'
import { useGpuInstanceManager } from '../useManager/useGpuInstanceManager'
import { GpuInstance } from '@/domain/gpuInstance'

export type UseRequestGpuInstancesProps = Omit<
  UseRequestEntitiesProps<GpuInstance>,
  'name'
>

export type UseRequestGpuInstancesReturn = UseRequestEntitiesReturn<GpuInstance>

export function useRequestGpuInstances(
  props: UseRequestGpuInstancesProps = {},
): UseRequestGpuInstancesReturn {
  const manager = useGpuInstanceManager()
  return useRequestEntities({ ...props, manager, name: 'gpuInstance' })
}
