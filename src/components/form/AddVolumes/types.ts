import { Volume } from '@/hooks/form/useAddVolume'

export type RemoveVolumeProps = {
  onRemove: () => void
}

export type AddVolumesProps = {
  volumes?: Volume[]
  onChange: (volumes: Volume[]) => void
} & Partial<RemoveVolumeProps>
