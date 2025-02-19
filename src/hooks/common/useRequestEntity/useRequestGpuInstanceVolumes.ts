import { useMemo } from 'react'
import { Volume } from '@/domain/volume'
import { useAppState } from '@/contexts/appState'
import { useVolumeManager } from '../useManager/useVolumeManager'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'
import { ImmutableVolume } from '@aleph-sdk/message'

export type UseRequestGpuInstanceVolumesProps = Omit<
  UseRequestEntitiesProps<Volume>,
  'name'
>

export type UseRequestGpuInstanceVolumesReturn =
  UseRequestEntitiesReturn<Volume>

export function useRequestGpuInstanceVolumes(
  props: UseRequestGpuInstanceVolumesProps = {},
): UseRequestGpuInstanceVolumesReturn {
  const [state] = useAppState()
  const gpuInstances = state.gpuInstance.entities

  const ids = useMemo(() => {
    if (!gpuInstances) return []

    return gpuInstances.flatMap((prog) => {
      return prog.volumes
        .filter((vol): vol is ImmutableVolume => 'ref' in vol)
        .map((vol) => vol.ref)
    })
  }, [gpuInstances])

  const manager = useVolumeManager()
  return useRequestEntities({
    ...props,
    manager,
    name: 'gpuInstanceVolume',
    ids,
  })
}
