import { useMemo } from 'react'
import { Program } from '@/domain/program'
import { Volume } from '@/domain/volume'

export type UseAttachedVolumesProps = {
  programs: Program[]
  volumes: Volume[]
}

export type UseAttachedVolumesReturn = {
  volumes: Volume[]
}

export function useAttachedVolumes({
  programs,
  volumes: allVolumes,
}: UseAttachedVolumesProps): UseAttachedVolumesReturn {
  const programsMap = useMemo(() => {
    return programs.reduce(
      (ac, cv) => {
        // @note: code volume
        ac[cv.code.ref] = true

        // @note: attached volumes
        // for (const volume of cv.volumes) {
        //   ac[volume] = true
        // }

        return ac
      },
      {} as Record<string, boolean>,
    )
  }, [programs])

  console.log('programs', programs)

  console.log(programsMap)

  const volumes = useMemo(() => {
    return allVolumes.filter((volume) => volume.id && !!programsMap[volume.id])
  }, [allVolumes, programsMap])

  console.log('volumes', allVolumes)

  return {
    volumes,
  }
}
