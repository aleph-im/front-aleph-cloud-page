import { useMemo, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { ImmutableVolume } from '@aleph-sdk/message'

export type useProgramsVolumesIdsReturn = string[]

export function useProgramsVolumesIds(): useProgramsVolumesIdsReturn {
  const [ids, setIds] = useState<string[]>([])

  const [state] = useAppState()
  const programs = state.program.entities

  useMemo(() => {
    if (!programs) return setIds([])

    setIds(
      programs.flatMap((program) => {
        const codeVolume = program.code.ref
        const runtimeVolume = program.runtime.ref
        const linkedVolumes = program.volumes
          .filter((vol): vol is ImmutableVolume => 'ref' in vol)
          .map((vol) => vol.ref)

        return [codeVolume, runtimeVolume, ...linkedVolumes]
      }),
    )
  }, [programs])

  return ids
}
