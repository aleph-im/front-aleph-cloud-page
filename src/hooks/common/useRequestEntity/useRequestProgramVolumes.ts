import { Volume } from '@/domain/volume'
import { useVolumeManager } from '../useManager/useVolumeManager'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'
import { useProgramsVolumesIds } from '../useProgramsVolumesIds'

export type UseRequestProgramVolumesProps = Omit<
  UseRequestEntitiesProps<Volume>,
  'name'
>

export type UseRequestProgramVolumesReturn = UseRequestEntitiesReturn<Volume>

export function useRequestProgramVolumes(
  props: UseRequestProgramVolumesProps = {},
): UseRequestProgramVolumesReturn {
  const ids = useProgramsVolumesIds()
  const manager = useVolumeManager()

  return useRequestEntities({ ...props, manager, name: 'programVolume', ids })
}
