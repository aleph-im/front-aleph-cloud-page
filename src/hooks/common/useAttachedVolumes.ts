import { Volume } from '@/domain/volume'
import { ImmutableVolume } from '@aleph-sdk/message'
import { Program } from '@/domain/program'
import { Instance } from '@/domain/instance'
import { Website } from '@/domain/website'
import { useMemo } from 'react'

export type UseAttachedVolumesProps = {
  programs?: Program[]
  instances?: Instance[]
  websites?: Website[]
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

export function getProgramVolumes(programs?: Program[]): string[] {
  if (!programs) return []

  return programs.flatMap((prog) => {
    const codeVolume = prog.code.ref
    const runtimeVolume = prog.runtime.ref
    const linkedVolumes = prog.volumes
      .filter((vol): vol is ImmutableVolume => 'ref' in vol)
      .map((vol) => vol.ref)

    return [codeVolume, runtimeVolume, ...linkedVolumes]
  })
}

export function getInstanceVolumes(instances?: Instance[]): string[] {
  if (!instances) return []

  return instances.flatMap((instance) =>
    instance.volumes
      .filter((vol): vol is ImmutableVolume => 'ref' in vol)
      .map((vol) => vol.ref),
  )
}

export function getWebsiteVolumes(websites?: Website[]): string[] {
  if (!websites) return []

  return websites.map((website) => website.volume_id)
}

export function useAttachedVolumes({
  instances,
  programs,
  websites,
  volumes,
}: UseAttachedVolumesProps = {}): UseAttachedVolumesReturn {
  const programVolumeIds = useMemo(
    () => getProgramVolumes(programs),
    [programs],
  )

  const instanceVolumeIds = useMemo(
    () => getInstanceVolumes(instances),
    [instances],
  )

  const websiteVolumeIds = useMemo(
    () => getWebsiteVolumes(websites),
    [websites],
  )

  const volumesMap = useMemo(
    () =>
      [...programVolumeIds, ...instanceVolumeIds, ...websiteVolumeIds].reduce(
        (ac, cv) => {
          ac[cv] = true
          return ac
        },
        {} as Record<string, boolean>,
      ),
    [programVolumeIds, instanceVolumeIds, websiteVolumeIds],
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
