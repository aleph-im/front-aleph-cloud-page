import { Volume } from '@/domain/volume'
import { useVolumeManager } from '../useManager/useVolumeManager'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'
import { useConfidentialsVolumesIds } from '../useConfidentialsVolumesIds'

export type UseRequestConfidentialVolumesProps = Omit<
  UseRequestEntitiesProps<Volume>,
  'name'
>

export type UseRequestConfidentialVolumesReturn =
  UseRequestEntitiesReturn<Volume>

export function useRequestConfidentialVolumes(
  props: UseRequestConfidentialVolumesProps = {},
): UseRequestConfidentialVolumesReturn {
  const ids = useConfidentialsVolumesIds()
  const manager = useVolumeManager()

  return useRequestEntities({
    ...props,
    manager,
    name: 'confidentialVolume',
    ids,
  })
}
