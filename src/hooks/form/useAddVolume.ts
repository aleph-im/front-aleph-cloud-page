import { useCallback, useState } from 'react'
import { createVolume } from '@/helpers/aleph'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { MachineVolume } from 'aleph-sdk-ts/dist/messages/program/programModel'

export enum VolumeType {
  New = 'new',
  Existing = 'existing',
  Persistent = 'persistent',
}

export type NewVolume = {
  id: string
  type: VolumeType.New
  fileSrc?: File
  mountPath: string
  size: number
  useLatest: boolean
}

export type ExistingVolume = {
  id: string
  type: VolumeType.Existing
  mountPath: string
  refHash: string
  useLatest: boolean
}

export type PersistentVolume = {
  id: string
  type: VolumeType.Persistent
  name: string
  mountPath: string
  size: number
}

export type Volume = NewVolume | ExistingVolume | PersistentVolume

// | MachineVolume
// | {
//     id: string
//     type: VolumeType
//     refHash?: string
//     size?: number
//     src?: File
//     mountpoint?: string
//     name?: string
//     useLatest?: boolean
//   }

export const defaultVolume: NewVolume = {
  id: `volume-0`,
  type: VolumeType.New,
  mountPath: '',
  size: 0,
  useLatest: true,
}

/**
 * Convert a list of volume objects from the form to a list of volume objects for the Aleph API
 */
export const displayVolumesToAlephVolumes = async (
  account: Account,
  volumes: Volume[],
): Promise<MachineVolume[]> => {
  const ret = []

  for (const volume of volumes) {
    if (volume.type === VolumeType.New && volume.fileSrc) {
      const createdVolume = await createVolume(account, volume.fileSrc)
      ret.push({
        ref: createdVolume.item_hash,
        mount: volume.mountPath || '',
        use_latest: false,
      })
    } else if (volume.type === VolumeType.Existing) {
      ret.push({
        ref: volume.refHash || '',
        mount: volume.mountPath || '',
        use_latest: volume.useLatest || false,
      })
    } else if (volume.type === VolumeType.Persistent) {
      ret.push({
        persistence: 'host',
        mount: volume.mountPath || '',
        size_mib: (volume.size || 2) * 1000,
        name: volume.name || '',
        is_read_only: () => false,
      })
    }
  }

  // @fixme: remove any and fix type error
  return ret as any
}

export type UseVolumeSelectorProps = {
  volume?: Volume
  onChange: (volumes: Volume) => void
}

export type UseVolumeSelectorReturn = {
  volume: Volume
  handleChange: (volumes: Volume) => void
}

export function useAddVolume({
  volume: volumeProp,
  onChange,
}: UseVolumeSelectorProps): UseVolumeSelectorReturn {
  const [volumeState, setVolumeState] = useState<Volume>({ ...defaultVolume })

  const volume = volumeProp || volumeState

  const handleChange = useCallback(
    (volume: Volume) => {
      setVolumeState(volume)
      onChange(volume)
    },
    [onChange],
  )

  // -------

  return {
    volume,
    handleChange,
  }
}
