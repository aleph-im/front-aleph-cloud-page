import { useCallback } from 'react'
import {
  NewVolumeField,
  VolumeField,
  defaultVolume as defaultStandaloneVolume,
} from './useAddVolume'
import { Control, useFieldArray } from 'react-hook-form'

export type UseAddVolumesProps = {
  name?: string
  control: Control
}

export type UseAddVolumesReturn = {
  name: string
  control: Control
  fields: (VolumeField & { id: string })[]
  handleAdd: () => void
  handleRemove: (index?: number) => void
}

export const defaultVolume: NewVolumeField = {
  ...defaultStandaloneVolume,
  mountPath: '',
  useLatest: false,
}

export function useAddVolumes({
  name = 'volumes',
  control,
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
    handleAdd,
    handleRemove,
  }
}
