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

export type UseRequestProgramVolumesProps = Omit<
  UseRequestEntitiesProps<Volume>,
  'name'
>

export type UseRequestProgramVolumesReturn = UseRequestEntitiesReturn<Volume>

export function useRequestProgramVolumes(
  props: UseRequestProgramVolumesProps = {},
): UseRequestProgramVolumesReturn {
  const [state] = useAppState()
  const programs = state.program.entities

  const ids = useMemo(() => {
    if (!programs) return []

    return programs.flatMap((prog) => {
      const codeVolume = prog.code.ref
      const linkedVolumes = prog.volumes
        .filter((vol): vol is ImmutableVolume => 'ref' in vol)
        .map((vol) => vol.ref)

      return [codeVolume, ...linkedVolumes]
    })
  }, [programs])

  const manager = useVolumeManager()
  return useRequestEntities({ ...props, manager, name: 'programVolume', ids })
}
