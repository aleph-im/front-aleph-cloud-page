import { Control } from 'react-hook-form'
import { InstanceSystemVolumeField } from '@/hooks/form/useAddVolume'

export type RemoveVolumeProps = {
  onRemove: () => void
}

export type AddVolumesProps = {
  name?: string
  control: Control
  systemVolume?: InstanceSystemVolumeField
} & Partial<RemoveVolumeProps>
