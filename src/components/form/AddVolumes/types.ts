import { Control } from 'react-hook-form'

export type RemoveVolumeProps = {
  onRemove: () => void
}

export type AddVolumesProps = {
  name?: string
  control: Control
} & Partial<RemoveVolumeProps>
