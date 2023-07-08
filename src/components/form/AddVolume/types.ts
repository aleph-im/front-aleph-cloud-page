import {
  ExistingVolumeProp,
  NewVolumeProp,
  PersistentVolumeProp,
  VolumeProp,
} from '@/hooks/form/useAddVolume'

export type RemoveVolumeProps = {
  volume: VolumeProp
  onRemove: (volumeId: string) => void
}

export type AddNewVolumeProps = {
  volume: NewVolumeProp
  onChange: (volume: NewVolumeProp) => void
  onRemove?: (volumeId: string) => void
}

export type AddExistingVolumeProps = {
  volume: ExistingVolumeProp
  onChange: (volume: ExistingVolumeProp) => void
  onRemove?: (volumeId: string) => void
}

export type AddPersistentVolumeProps = {
  volume: PersistentVolumeProp
  onChange: (volume: PersistentVolumeProp) => void
  onRemove?: (volumeId: string) => void
}

export type AddVolumeProps = {
  volume: VolumeProp
  isStandAlone?: boolean
  onChange: (volume: VolumeProp) => void
  onRemove?: (volumeId: string) => void
}
