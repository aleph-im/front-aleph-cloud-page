import { useCallback } from 'react'
import {
  ExistingVolumeStandaloneField,
  InstanceSystemVolumeField,
  VolumeField,
  defaultVolume as defaultStandaloneVolume,
} from './useAddVolume'
import { Control, useFieldArray } from 'react-hook-form'

export type UseAddVolumesProps = {
  name?: string
  control: Control
  systemVolume?: InstanceSystemVolumeField
}

export type UseAddVolumesReturn = {
  name: string
  control: Control
  fields: (VolumeField & { id: string })[]
  systemVolume?: InstanceSystemVolumeField
  handleAdd: () => void
  handleRemove: (index?: number) => void
}

export const defaultVolume: ExistingVolumeStandaloneField = {
  ...defaultStandaloneVolume,
  mountPath: '',
  useLatest: false,
}

export function useAddVolumes({
  name = 'volumes',
  control,
  systemVolume,
  ...rest
}: UseAddVolumesProps): UseAddVolumesReturn {
  const volumesCtrl = useFieldArray({
    control,
    name,
    shouldUnregister: true,
  })

  const { remove: handleRemove, append } = volumesCtrl
  const fields = volumesCtrl.fields as (VolumeField & { id: string })[]

  const handleAdd = useCallback(() => {
    append({ ...defaultVolume })
  }, [append])

  return {
    name,
    control,
    fields,
    systemVolume,
    ...rest,
    handleAdd,
    handleRemove,
  }
}
