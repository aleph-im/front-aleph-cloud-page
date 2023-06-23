import { createVolume } from '@/helpers/aleph'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import {
  MachineVolume,
  PersistentVolume,
} from 'aleph-sdk-ts/dist/messages/program/programModel'

export type VolumeTypes = 'new' | 'existing' | 'persistent'

export type Volume = {
  type: VolumeTypes
  refHash?: string
  size?: number
  src?: File
  mountpoint?: string
  name?: string
  useLatest?: boolean
}

export const defaultVolume: Volume = {
  type: 'new',
  size: 2,
  useLatest: true,
}

/**
 * Convert a list of volume objects from the form to a list of volume objects for the Aleph API
 */
export const displayVolumesToAlephVolumes = async (
  account: Account,
  volumes: Volume[],
): Promise<(MachineVolume | PersistentVolume)[]> => {
  const ret = []

  for (const volume of volumes) {
    if (volume.type === 'new' && volume.src) {
      const createdVolume = await createVolume(account, volume.src)
      ret.push({
        ref: createdVolume.item_hash,
        mount: volume.mountpoint || '',
        use_latest: false,
      })
    } else if (volume.type === 'existing') {
      ret.push({
        ref: volume.refHash || '',
        mount: volume.mountpoint || '',
        use_latest: volume.useLatest || false,
      })
    } else if (volume.type === 'persistent') {
      ret.push({
        persistence: 'host',
        mount: volume.mountpoint || '',
        size_mib: (volume.size || 2) * 1000,
        name: volume.name || '',
        is_read_only: () => false,
      })
    }
  }

  // @fixme: remove any and fix type error
  return ret as any
}
