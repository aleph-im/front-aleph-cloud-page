import { useCallback, useMemo } from 'react'
import { convertBitUnits } from '@/helpers/utils'
import { Volume, VolumeManager, VolumeType } from '@/domain/volume'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { formValidationRules } from '@/helpers/errors'

export type NewVolumeStandaloneField = {
  volumeType: VolumeType.New
  fileSrc?: File
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
  name: string
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
  fileSrcCtrl: UseControllerReturn<any, any>
  volumeSize: string
  handleRemove?: () => void
}
export function useAddNewVolumeProps(
  props: UseAddNewVolumeProps,
): UseAddNewVolumeReturn {
  const { name, index, control, defaultValue, onRemove: handleRemove } = props

  const { required } = formValidationRules

  const isStandAlone = index === undefined
  const n = isStandAlone ? name : `${name}.${index}`

  const fileSrcCtrl = useController({
    control,
    name: `${n}.fileSrc`,
    defaultValue: defaultValue?.fileSrc,
    rules: { required },
  })

  const mountPathCtrl = useController({
    control,
    name: `${n}.mountPath`,
    defaultValue: defaultValue?.mountPath,
    rules: {
      validate: {
        required: (v) => isStandAlone || !!v,
      },
    },
  })

  const useLatestCtrl = useController({
    control,
    name: `${n}.useLatest`,
    defaultValue: defaultValue?.useLatest,
    rules: {
      validate: {
        required: (v) => isStandAlone || !!v,
      },
    },
  })

  const { value: fileSrc } = fileSrcCtrl.field

  const volumeSize = useMemo(() => {
    const size = VolumeManager.getVolumeSize({
      volumeType: VolumeType.New,
      fileSrc,
    } as Volume)

    return convertBitUnits(size, {
      from: 'mb',
      to: 'mb',
      displayUnit: true,
    }) as string
  }, [fileSrc])

  return {
    isStandAlone: index === undefined,
    fileSrcCtrl,
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
  name,
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddExistingVolumeProps): UseAddExistingVolumeReturn {
  const { required } = formValidationRules

  const refHashCtrl = useController({
    control,
    name: `${name}.${index}.refHash`,
    defaultValue: defaultValue?.refHash,
    rules: { required },
  })

  const mountPathCtrl = useController({
    control,
    name: `${name}.${index}.mountPath`,
    defaultValue: defaultValue?.mountPath,
    rules: { required },
  })

  const useLatestCtrl = useController({
    control,
    name: `${name}.${index}.useLatest`,
    defaultValue: defaultValue?.useLatest,
    rules: { required },
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
  name = 'volumes',
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddPersistentVolumeProps): UseAddPersistentVolumeReturn {
  const { required } = formValidationRules

  const nameCtrl = useController({
    control,
    name: `${name}.${index}.name`,
    defaultValue: defaultValue?.name,
    rules: { required },
  })

  const mountPathCtrl = useController({
    control,
    name: `${name}.${index}.mountPath`,
    defaultValue: defaultValue?.mountPath,
    rules: { required },
  })

  const sizeCtrl = useController({
    control,
    name: `${name}.${index}.size`,
    defaultValue: defaultValue?.size || 0,
    rules: {
      required,
      onChange(e) {
        if (typeof e.target.value !== 'string') return

        const sizeGB = Number(e.target.value)
        const size = convertBitUnits(sizeGB, {
          from: 'gb',
          to: 'mb',
          displayUnit: false,
        }) as number

        sizeCtrl.field.onChange(size)
      },
    },
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
  const { required } = formValidationRules

  const isStandAlone = index === undefined
  const n = isStandAlone ? name : `${name}.${index}`

  const volumeTypeCtrl = useController({
    control,
    name: `${n}.volumeType`,
    defaultValue: VolumeType.New,
    rules: { required },
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
