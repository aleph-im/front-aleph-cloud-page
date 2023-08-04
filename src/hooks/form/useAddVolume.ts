import { useCallback, useMemo } from 'react'
import { convertBitUnits } from '@/helpers/utils'
import { Volume, VolumeManager, VolumeType } from '@/domain/volume'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type NewVolumeStandaloneField = {
  volumeType: VolumeType.New
  file?: File
}

export type NewVolumeField = NewVolumeStandaloneField & {
  mountPath: string
  useLatest: boolean
}

export type ExistingVolumeField = {
  volumeType: VolumeType.Existing
  mountPath: string
  refHash: string
  useLatest: boolean
}

export type PersistentVolumeField = {
  volumeType: VolumeType.Persistent
  name: string
  mountPath: string
  size: number
}

export const defaultVolume: NewVolumeStandaloneField = {
  volumeType: VolumeType.New,
}

export type VolumeField =
  | NewVolumeStandaloneField
  | NewVolumeField
  | ExistingVolumeField
  | PersistentVolumeField

export type UseAddVolumeCommonProps = {
  name?: string
  index?: number
  control: Control
  onRemove?: () => void
}

export type UseAddNewVolumeProps = UseAddVolumeCommonProps & {
  defaultValue?: NewVolumeField
}

export type UseAddNewVolumeReturn = {
  isStandAlone: boolean
  mountPathCtrl: UseControllerReturn<any, any>
  useLatestCtrl: UseControllerReturn<any, any>
  fileCtrl: UseControllerReturn<any, any>
  volumeSize: string
  handleRemove?: () => void
}
export function useAddNewVolumeProps({
  name = '',
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddNewVolumeProps): UseAddNewVolumeReturn {
  const isStandAlone = index === undefined
  const n = isStandAlone ? name : `${name}.${index}`

  const fileCtrl = useController({
    control,
    name: `${n}.file`,
    defaultValue: defaultValue?.file,
  })

  const mountPathCtrl = useController({
    control,
    name: `${n}.mountPath`,
    defaultValue: defaultValue?.mountPath,
  })

  const useLatestCtrl = useController({
    control,
    name: `${n}.useLatest`,
    defaultValue: defaultValue?.useLatest,
  })

  const { value: file } = fileCtrl.field

  const volumeSize = useMemo(() => {
    const size = VolumeManager.getVolumeSize({
      volumeType: VolumeType.New,
      file,
    } as Volume)

    return convertBitUnits(size, {
      from: 'mb',
      to: 'mb',
      displayUnit: true,
    }) as string
  }, [file])

  return {
    isStandAlone: index === undefined,
    fileCtrl,
    mountPathCtrl,
    useLatestCtrl,
    volumeSize,
    handleRemove,
  }
}

// -------------

export type UseAddExistingVolumeProps = UseAddVolumeCommonProps & {
  defaultValue?: ExistingVolumeField
}

export type UseAddExistingVolumeReturn = {
  refHashCtrl: UseControllerReturn<any, any>
  mountPathCtrl: UseControllerReturn<any, any>
  useLatestCtrl: UseControllerReturn<any, any>
  handleRemove?: () => void
}

export function useAddExistingVolumeProps({
  name = '',
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddExistingVolumeProps): UseAddExistingVolumeReturn {
  const refHashCtrl = useController({
    control,
    name: `${name}.${index}.refHash`,
    defaultValue: defaultValue?.refHash,
  })

  const mountPathCtrl = useController({
    control,
    name: `${name}.${index}.mountPath`,
    defaultValue: defaultValue?.mountPath,
  })

  const useLatestCtrl = useController({
    control,
    name: `${name}.${index}.useLatest`,
    defaultValue: defaultValue?.useLatest,
  })

  return {
    refHashCtrl,
    mountPathCtrl,
    useLatestCtrl,
    handleRemove,
  }
}

// -------------

export type UseAddPersistentVolumeProps = UseAddVolumeCommonProps & {
  defaultValue?: PersistentVolumeField
}

export type UseAddPersistentVolumeReturn = {
  nameCtrl: UseControllerReturn<any, any>
  mountPathCtrl: UseControllerReturn<any, any>
  sizeCtrl: UseControllerReturn<any, any>
  volumeSize: number
  handleRemove?: () => void
}

export function useAddPersistentVolumeProps({
  name = '',
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddPersistentVolumeProps): UseAddPersistentVolumeReturn {
  const nameCtrl = useController({
    control,
    name: `${name}.${index}.name`,
    defaultValue: defaultValue?.name,
  })

  const mountPathCtrl = useController({
    control,
    name: `${name}.${index}.mountPath`,
    defaultValue: defaultValue?.mountPath,
  })

  const sizeCtrl = useController({
    control,
    name: `${name}.${index}.size`,
    defaultValue: defaultValue?.size || 0,
  })

  const { value: size } = sizeCtrl.field

  const volumeSize = useMemo(() => {
    return convertBitUnits(size, {
      from: 'mb',
      to: 'gb',
      displayUnit: false,
    }) as number
  }, [size])

  return {
    nameCtrl,
    mountPathCtrl,
    sizeCtrl,
    volumeSize,
    handleRemove,
  }
}

// -------------

export type UseAddVolumeProps = {
  name?: string
  index?: number
  control: Control
  volumeType?: VolumeType
  onRemove?: (index?: number) => void
}

export type UseAddVolumeReturn = {
  name: string
  index?: number
  control: Control
  volumeTypeCtrl: UseControllerReturn<any, any>
  onRemove?: () => void
}

export function useAddVolume({
  name = 'volumes',
  index,
  control,
  onRemove,
}: UseAddVolumeProps): UseAddVolumeReturn {
  const isStandAlone = index === undefined
  const n = isStandAlone ? name : `${name}.${index}`

  const volumeTypeCtrl = useController({
    control,
    name: `${n}.volumeType`,
    defaultValue: VolumeType.New,
  })

  const handleRemove = useCallback(() => {
    onRemove && onRemove(index)
  }, [index, onRemove])

  return {
    name,
    index,
    control,
    volumeTypeCtrl,
    onRemove: handleRemove,
  }
}
