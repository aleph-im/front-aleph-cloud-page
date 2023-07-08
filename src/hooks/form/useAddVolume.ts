import { ChangeEvent, useCallback, useId, useMemo, useState } from 'react'
import { convertBitUnits } from '@/helpers/utils'
import { VolumeManager, VolumeType } from '@/domain/volume'

export type NewVolumeProp = {
  id: string
  volumeType: VolumeType.New
  fileSrc?: File
  mountPath?: string
  useLatest?: boolean
  size?: number
}

export type ExistingVolumeProp = {
  id: string
  volumeType: VolumeType.Existing
  mountPath: string
  refHash: string
  useLatest: boolean
  size?: number
}

export type PersistentVolumeProp = {
  id: string
  volumeType: VolumeType.Persistent
  name: string
  mountPath: string
  size: number
}

export const defaultVolume: NewVolumeProp = {
  id: `volume-0`,
  volumeType: VolumeType.New,
  mountPath: '',
  size: 0,
  useLatest: true,
}

export type VolumeProp =
  | NewVolumeProp
  | ExistingVolumeProp
  | PersistentVolumeProp

export type UseAddNewVolumeProps = {
  volume: NewVolumeProp
  onChange: (volume: NewVolumeProp) => void
  onRemove?: (volumeId: string) => void
}

export type UseAddNewVolumeReturn = {
  id: string
  volume: NewVolumeProp
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
}: UseAddNewVolumeProps): UseAddNewVolumeReturn {
  const id = useId()

  const handleFileSrcChange = useCallback(
    (fileSrc?: File) => {
      if (!fileSrc) return //@todo: Handle error in UI

      const newVolume: NewVolumeProp = { ...volume, fileSrc }

      const size = VolumeManager.getVolumeSize(newVolume)
      newVolume.size = size

      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleMountPathChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const mountPath = e.target.value
      const newVolume: NewVolumeProp = { ...volume, mountPath }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleUseLatestChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const useLatest = e.target.checked
      const newVolume: NewVolumeProp = { ...volume, useLatest }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const volumeSize = useMemo(
    () =>
      convertBitUnits(volume.size || 0, {
        from: 'mb',
        to: 'kb',
        displayUnit: true,
      }) as string,
    [volume],
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
  volume: ExistingVolumeProp
  onChange: (volume: ExistingVolumeProp) => void
  onRemove?: (volumeId: string) => void
}

export type UseAddExistingVolumeReturn = {
  id: string
  volume: ExistingVolumeProp
  handleRefHashChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleMountPathChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleUseLatestChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove?: (volumeId: string) => void
}

export function useAddExistingVolumeProps({
  volume,
  onChange,
  onRemove: handleRemove,
}: UseAddExistingVolumeProps): UseAddExistingVolumeReturn {
  const id = useId()

  const handleRefHashChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const refHash = e.target.value
      // @todo: Get the file from ipfs, compute and update the size
      const newVolume: ExistingVolumeProp = { ...volume, refHash }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleMountPathChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const mountPath = e.target.value
      const newVolume: ExistingVolumeProp = { ...volume, mountPath }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleUseLatestChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const useLatest = e.target.checked
      const newVolume: ExistingVolumeProp = { ...volume, useLatest }
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
  volume: PersistentVolumeProp
  onChange: (volume: PersistentVolumeProp) => void
  onRemove?: (volumeId: string) => void
}

export type UseAddPersistentVolumeReturn = {
  id: string
  volume: PersistentVolumeProp
  volumeSize: number
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleMountPathChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSizeChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove?: (volumeId: string) => void
}

export function useAddPersistentVolumeProps({
  volume,
  onChange,
  onRemove: handleRemove,
}: UseAddPersistentVolumeProps): UseAddPersistentVolumeReturn {
  const id = useId()

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      const newVolume: PersistentVolumeProp = { ...volume, name }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleMountPathChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const mountPath = e.target.value
      const newVolume: PersistentVolumeProp = { ...volume, mountPath }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const handleSizeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const sizeGB = Number(e.target.value)
      const size = convertBitUnits(sizeGB, {
        from: 'gb',
        to: 'mb',
        displayUnit: false,
      }) as number
      const newVolume: PersistentVolumeProp = { ...volume, size }
      onChange(newVolume)
    },
    [onChange, volume],
  )

  const volumeSize = useMemo(
    () =>
      convertBitUnits(volume.size, {
        from: 'mb',
        to: 'gb',
        displayUnit: false,
      }) as number,
    [volume],
  )

  return {
    id,
    volume,
    volumeSize,
    handleNameChange,
    handleMountPathChange,
    handleSizeChange,
    handleRemove,
  }
}

// -------------

export type UseAddVolumeProps = {
  volume?: VolumeProp
  onChange: (volume: VolumeProp) => void
}

export type UseAddVolumeReturn = {
  volume: VolumeProp
  handleChange: (volume: VolumeProp) => void
}

export function useAddVolume({
  volume: volumeProp,
  onChange,
}: UseAddVolumeProps): UseAddVolumeReturn {
  const [volumeState, setVolumeState] = useState<VolumeProp>({
    ...defaultVolume,
  })
  const volume = volumeProp || volumeState

  const handleChange = useCallback(
    (volume: VolumeProp) => {
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
