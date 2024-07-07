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

export type UseRequestInstanceVolumesProps = Omit<
  UseRequestEntitiesProps<Volume>,
  'name'
>

export type UseRequestInstanceVolumesReturn = UseRequestEntitiesReturn<Volume>

export function useRequestInstanceVolumes(
  props: UseRequestInstanceVolumesProps = {},
): UseRequestInstanceVolumesReturn {
  const [state] = useAppState()
  const instances = state.instance.entities

  const ids = useMemo(() => {
    if (!instances) return []

    return instances.flatMap((prog) => {
      return prog.volumes
        .filter((vol): vol is ImmutableVolume => 'ref' in vol)
        .map((vol) => vol.ref)
    })
  }, [instances])

  const manager = useVolumeManager()
  return useRequestEntities({ ...props, manager, name: 'instanceVolume', ids })
}
