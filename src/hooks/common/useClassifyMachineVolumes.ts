import { isVolumeEphemeral, isVolumePersistent } from '@/helpers/utils'
import {
  ImmutableVolume,
  MachineVolume,
  PersistentVolume,
} from '@aleph-sdk/message'
import { useEffect, useMemo, useState } from 'react'
import { useVolumeManager } from './useManager/useVolumeManager'

export type useClassifyMachineVolumesProps = {
  volumes?: MachineVolume[]
}
export type ClassifyMachineVolumesReturn = {
  persistentVolumes: PersistentVolume[]
  immutableVolumes: ImmutableVolume[]
}

export default function useClassifyMachineVolumes({
  volumes,
}: useClassifyMachineVolumesProps): ClassifyMachineVolumesReturn {
  const volumeManager = useVolumeManager()

  const [immutableVolumes, setImmutableVolumes] = useState<ImmutableVolume[]>(
    [],
  )

  // Filter persistent volumes
  const persistentVolumes = useMemo(() => {
    if (!volumes) return []
    return volumes.filter((volume) =>
      isVolumePersistent(volume),
    ) as PersistentVolume[]
  }, [volumes])

  // Fetch immutable volumes
  useEffect(() => {
    if (!volumes || !volumeManager) return

    const buildVolumes = async () => {
      const rawVolumes = volumes.filter(
        (volume) => !isVolumePersistent(volume) && !isVolumeEphemeral(volume),
      ) as ImmutableVolume[]

      const decoratedVolumes = await Promise.all(
        rawVolumes.map(async (rawVolume) => {
          const extraInfo = await volumeManager.get(rawVolume.ref)

          return {
            ...rawVolume,
            ...extraInfo,
          }
        }),
      )

      setImmutableVolumes(decoratedVolumes)
    }

    buildVolumes()
  }, [volumes, volumeManager])

  return {
    persistentVolumes,
    immutableVolumes,
  }
}
