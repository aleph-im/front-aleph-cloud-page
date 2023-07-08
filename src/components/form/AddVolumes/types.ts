import { VolumeProp } from '@/hooks/form/useAddVolume'

export type RemoveVolumeProps = {
  onRemove: () => void
}

export type AddVolumesProps = {
  volumes?: VolumeProp[]
  onChange: (volumes: VolumeProp[]) => void
} & Partial<RemoveVolumeProps>
