import { ChangeEvent, useCallback, useId, useMemo, useState } from 'react'
import { createVolume } from '@/helpers/aleph'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { MachineVolume } from 'aleph-sdk-ts/dist/messages/program/programModel'
import { humanReadableSize } from '@/helpers/utils'

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

export type UseAddNewVolumeProps = {
  volume: NewVolume
  onChange: (volume: NewVolume) => void
  onRemove?: (volumeId: string) => void
}

export type UseAddNewVolumeReturn = {
  id: string
  volume: Volume
  volumeSize: string
  handleFileSrcChange: (fileSrc?: File) => void
  handleMountPathChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleUseLatestChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove?: (volumeId: string) => void
}

export function useAddNewVolumeProps({
  volume,
  onChange,
  onRemove: handleRemove,
}: UseAddNewVolumeProps) {
  const id = useId()

  const handleFileSrcChange = useCallback(
    (fileSrc?: File) => {
      if (!fileSrc) return //@todo: Handle error in UI
      const newVolume: NewVolume = { ...volume, fileSrc }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleMountPathChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const mountPath = e.target.value
      const newVolume: NewVolume = { ...volume, mountPath }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleUseLatestChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const useLatest = e.target.checked
      const newVolume: NewVolume = { ...volume, useLatest }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const volumeSize = useMemo(
    () => humanReadableSize((volume.fileSrc?.size || 0) / 1000),
    [volume.fileSrc?.size],
  )

  return {
    id,
    volume,
    volumeSize,
    handleFileSrcChange,
    handleMountPathChange,
    handleUseLatestChange,
    handleRemove,
  }
}

// -------------

export type UseAddExistingVolumeProps = {
  volume: ExistingVolume
  onChange: (volume: ExistingVolume) => void
  onRemove?: (volumeId: string) => void
}

export type UseAddExistingVolumeReturn = {
  id: string
  volume: Volume
  handleRefHashChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleMountPathChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleUseLatestChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove?: (volumeId: string) => void
}

export function useAddExistingVolumeProps({
  volume,
  onChange,
  onRemove: handleRemove,
}: UseAddExistingVolumeProps) {
  const id = useId()

  const handleRefHashChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const refHash = e.target.value
      const newVolume: ExistingVolume = { ...volume, refHash }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleMountPathChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const mountPath = e.target.value
      const newVolume: ExistingVolume = { ...volume, mountPath }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleUseLatestChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const useLatest = e.target.checked
      const newVolume: ExistingVolume = { ...volume, useLatest }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  return {
    id,
    volume,
    handleRefHashChange,
    handleMountPathChange,
    handleUseLatestChange,
    handleRemove,
  }
}

// -------------

export type UseAddPersistentVolumeProps = {
  volume: PersistentVolume
  onChange: (volume: PersistentVolume) => void
  onRemove?: (volumeId: string) => void
}

export type UseAddPersistentVolumeReturn = {
  id: string
  volume: Volume
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleMountPathChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSizeChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove?: (volumeId: string) => void
}

export function useAddPersistentVolumeProps({
  volume,
  onChange,
  onRemove: handleRemove,
}: UseAddPersistentVolumeProps) {
  const id = useId()

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      const newVolume: PersistentVolume = { ...volume, name }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleMountPathChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const mountPath = e.target.value
      const newVolume: PersistentVolume = { ...volume, mountPath }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleSizeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const size = Number(e.target.value)
      const newVolume: PersistentVolume = { ...volume, size }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  return {
    id,
    volume,
    handleNameChange,
    handleMountPathChange,
    handleSizeChange,
    handleRemove,
  }
}

// -------------

export type UseAddVolumeProps = {
  volume?: Volume
  onChange: (volume: Volume) => void
}

export type UseAddVolumeReturn = {
  volume: Volume
  handleChange: (volume: Volume) => void
}

export function useAddVolume({
  volume: volumeProp,
  onChange,
}: UseAddVolumeProps): UseAddVolumeReturn {
  const [volumeState, setVolumeState] = useState<Volume>({ ...defaultVolume })
  const volume = volumeProp || volumeState

  const handleChange = useCallback(
    (volume: Volume) => {
      setVolumeState(volume)
      onChange(volume)
    },
    [onChange],
  )

  return {
    volume,
    handleChange,
  }
}
