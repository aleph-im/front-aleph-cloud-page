import {
  ExistingVolumeField,
  NewVolumeField,
  PersistentVolumeField,
  VolumeField,
} from '@/hooks/form/useAddVolume'
import { Control } from 'react-hook-form'

export type AddVolumeCommonProps = {
  name?: string
  index?: number
  control: Control
  onRemove?: (index?: number) => void
}

export type AddNewVolumeStandaloneProps = Omit<
  AddVolumeCommonProps,
  'onRemove' | 'index'
> & {
  defaultValue?: NewVolumeField
}

export type AddNewVolumeProps = AddVolumeCommonProps & {
  defaultValue?: NewVolumeField
}

export type AddExistingVolumeProps = AddVolumeCommonProps & {
  defaultValue?: ExistingVolumeField
}

export type AddPersistentVolumeProps = AddVolumeCommonProps & {
  defaultValue?: PersistentVolumeField
}

// ---------

export type RemoveVolumeProps = {
  onRemove: () => void
}

export type AddVolumeProps = AddVolumeCommonProps & {
  defaultValue?: VolumeField
}
