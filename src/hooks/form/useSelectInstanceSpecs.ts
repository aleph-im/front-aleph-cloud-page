import { EntityType } from '@/helpers/constants'
import { convertByteUnits } from '@/helpers/utils'
import { useEffect, useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type InstanceSpecsField = {
  cpu: number
  ram: number
  storage: number
  disabled?: boolean
}

export function updateSpecsStorage(
  specs: InstanceSpecsField,
  isPersistent: boolean,
): InstanceSpecsField {
  return {
    ...specs,
    disabled: isPersistent && specs.cpu >= 6,
    storage: convertByteUnits(specs.cpu * 2 * (isPersistent ? 10 : 1), {
      from: 'GiB',
      to: 'MiB',
    }),
  }
}

// @note: https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
export function getDefaultSpecsOptions(
  isPersistent: boolean,
): InstanceSpecsField[] {
  return [1, 2, 4, 6, 8, 12].map((cpu) =>
    updateSpecsStorage(
      {
        cpu,
        ram: convertByteUnits(cpu * 2, { from: 'GiB', to: 'MiB' }),
        storage: 0,
      },
      isPersistent,
    ),
  )
}

export type UseSelectInstanceSpecsProps = {
  name?: string
  control: Control
  defaultValue?: InstanceSpecsField
  options?: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.Program
  isPersistent?: boolean
}

export type UseSelectInstanceSpecsReturn = {
  specsCtrl: UseControllerReturn<any, any>
  options: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.Program
  isPersistent: boolean
}

export function useSelectInstanceSpecs({
  name = 'specs',
  control,
  defaultValue,
  type,
  options: optionsProp,
  isPersistent = false,
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const options = useMemo(
    () => optionsProp || getDefaultSpecsOptions(isPersistent),
    [isPersistent, optionsProp],
  )

  const specsCtrl = useController({
    control,
    name,
    defaultValue,
  })

  const { value, onChange } = specsCtrl.field

  useEffect(() => {
    if (!value) return

    let updatedSpecs = updateSpecsStorage(value, isPersistent)
    if (updatedSpecs.storage === value.storage) return

    if (updatedSpecs.disabled) {
      updatedSpecs = options[0]
    }

    onChange(updatedSpecs)
  }, [isPersistent, value, onChange, options])

  return {
    specsCtrl,
    options,
    type,
    isPersistent,
  }
}
