import { Volume } from '@/domain/volume'
import { useVolumeManager } from '../useManager/useVolumeManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestVolumesProps = Omit<
  UseRequestEntitiesProps<Volume>,
  'name'
>

export type UseRequestVolumesReturn = UseRequestEntitiesReturn<Volume>

export function useRequestVolumes(
  props: UseRequestVolumesProps = {},
): UseRequestVolumesReturn {
  const manager = useVolumeManager()
  return useRequestEntities({ ...props, manager, name: 'volume' })
}
