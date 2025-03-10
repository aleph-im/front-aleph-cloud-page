import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { convertByteUnits, humanReadableSize } from '@/helpers/utils'
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

export type InstanceSystemVolumeField = {
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

  return {
    isStandAlone: index === undefined,
    fileCtrl,
    mountPathCtrl,
    useLatestCtrl,
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
  volumeSize: string
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

  const { value: refHash } = refHashCtrl.field
  const [volumeSize, setVolumeSize] = useState<string>('')

  useEffect(() => {
    async function load() {
      const size = await VolumeManager.getVolumeSize({
        volumeType: VolumeType.Existing,
        refHash,
      } as Volume)

      const hSize = humanReadableSize(size, 'MiB')
      setVolumeSize(hSize)
    }
    load()
  }, [refHash])

  return {
    refHashCtrl,
    mountPathCtrl,
    useLatestCtrl,
    volumeSize,
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
  sizeValue: number | undefined
  sizeHandleChange: (e: ChangeEvent<HTMLInputElement>) => void
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
    defaultValue: defaultValue?.size,
  })

  const sizeHandleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value)
      const size = convertByteUnits(val, {
        from: 'GiB',
        to: 'MiB',
        displayUnit: false,
      })
      sizeCtrl.field.onChange(size)
    },
    [sizeCtrl.field],
  )

  const sizeValue = useMemo(() => {
    return sizeCtrl.field.value
      ? convertByteUnits(sizeCtrl.field.value, {
          from: 'MiB',
          to: 'GiB',
          displayUnit: false,
        })
      : undefined
  }, [sizeCtrl.field])

  return {
    nameCtrl,
    mountPathCtrl,
    sizeCtrl,
    sizeValue,
    sizeHandleChange,
    handleRemove,
  }
}

// -------------

export type UseAddInstanceSystemVolumeProps = {
  control: Control
  defaultValue?: InstanceSystemVolumeField
}

export type UseAddInstanceSystemVolumeReturn = {
  sizeCtrl: UseControllerReturn<any, any>
}

export function useAddInstanceSystemVolumeProps({
  control,
  defaultValue,
}: UseAddInstanceSystemVolumeProps): UseAddInstanceSystemVolumeReturn {
  const sizeCtrl = useController({
    control,
    name: `systemVolume.size`,
    defaultValue,
  })

  const { value, onChange } = sizeCtrl.field

  sizeCtrl.field.onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value)
      const size = convertByteUnits(val, {
        from: 'GiB',
        to: 'MiB',
        displayUnit: false,
      })
      onChange(size)
    },
    [onChange],
  )

  sizeCtrl.field.value = useMemo(() => {
    return value
      ? convertByteUnits(value, { from: 'MiB', to: 'GiB', displayUnit: false })
      : undefined
  }, [value])

  return {
    sizeCtrl,
  }
}

// -------------

export type UseAddVolumeProps = {
  name?: string
  index?: number
  control: Control
  volumeType?: VolumeType
  defaultValue?: VolumeField
  onRemove?: (index?: number) => void
}

export type UseAddVolumeReturn = {
  name: string
  index?: number
  control: Control
  volumeTypeCtrl: UseControllerReturn<any, any>
  defaultValue?: VolumeField
  onRemove?: () => void
}

export function useAddVolume({
  name = 'volumes',
  index,
  control,
  defaultValue,
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
    defaultValue,
    onRemove: handleRemove,
  }
}
