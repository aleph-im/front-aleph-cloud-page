import {
  ExistingVolume,
  NewVolume,
  PersistentVolume,
  Volume,
} from '@/hooks/form/useAddVolume'

export type RemoveVolumeProps = {
  volume: Volume
  onRemove: (volumeId: string) => void
}

export type NewVolumeTabComponentProps = {
  volume: NewVolume
  onChange: (volume: NewVolume) => void
  onRemove?: (volumeId: string) => void
}

export type ExistingVolumeTabComponentProps = {
  volume: ExistingVolume
  onChange: (volume: ExistingVolume) => void
  onRemove?: (volumeId: string) => void
}

export type PersistentVolumeTabComponentProps = {
  volume: PersistentVolume
  onChange: (volume: PersistentVolume) => void
  onRemove?: (volumeId: string) => void
}

export type AddVolumeProps = {
  volume: Volume
  isStandAlone?: boolean
  onChange: (volume: Volume) => void
  onRemove?: (volumeId: string) => void
}
