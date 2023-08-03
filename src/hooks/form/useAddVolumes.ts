import { useCallback } from 'react'
import { VolumeField, defaultVolume } from './useAddVolume'
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

export function useAddVolumes({
  name = 'volumes',
  control,
}: UseAddVolumesProps): UseAddVolumesReturn {
  const volumesCtrl = useFieldArray({
    control,
    name,
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
