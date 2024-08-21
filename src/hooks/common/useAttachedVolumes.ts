import { Volume } from '@/domain/volume'
import { useMemo } from 'react'
import { useProgramsVolumesIds } from './useProgramsVolumesIds'
import { useConfidentialsVolumesIds } from './useConfidentialsVolumesIds'
import { useInstancesVolumesIds } from './useInstancesVolumesIds'
import { useWebsitesVolumesIds } from './useWebsitesVolumesIds'

export type UseAttachedVolumesProps = {
  volumes?: Volume[]
}

export type UseAttachedVolumesReturn = {
  total: {
    amount: number
    size: number
  }
  linked: {
    amount: number
    size: number
  }
  unlinked: {
    amount: number
    size: number
  }
}

export function useAttachedVolumes({
  volumes,
}: UseAttachedVolumesProps = {}): UseAttachedVolumesReturn {
  const programVolumeIds = useProgramsVolumesIds()
  const instanceVolumeIds = useInstancesVolumesIds()
  const confidentialVolumeIds = useConfidentialsVolumesIds()
  const websiteVolumeIds = useWebsitesVolumesIds()

  const volumesMap = useMemo(
    () =>
      [
        ...programVolumeIds,
        ...instanceVolumeIds,
        ...confidentialVolumeIds,
        ...websiteVolumeIds,
      ].reduce(
        (ac, cv) => {
          ac[cv] = true
          return ac
        },
        {} as Record<string, boolean>,
      ),
    [
      programVolumeIds,
      instanceVolumeIds,
      confidentialVolumeIds,
      websiteVolumeIds,
    ],
  )

  const result = useMemo(
    () =>
      (volumes || []).reduce(
        (ac, cv) => {
          const key = !!volumesMap[cv.id] ? 'linked' : 'unlinked'

          ac[key].amount += 1
          ac[key].size += cv.size || 0

          ac.total.amount += 1
          ac.total.size += cv.size || 0

          return ac
        },
        {
          total: {
            amount: 0,
            size: 0,
          },
          linked: {
            amount: 0,
            size: 0,
          },
          unlinked: {
            amount: 0,
            size: 0,
          },
        },
      ),
    [volumes, volumesMap],
  )

  return result
}
