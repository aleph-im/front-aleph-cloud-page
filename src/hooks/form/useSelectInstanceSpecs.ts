import { CRNSpecs } from '@/domain/node'
import { EntityType, PaymentMethod } from '@/helpers/constants'
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
  isPersistent = true,
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
  isPersistent = true,
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
  paymentMethod?: PaymentMethod
  nodeSpecs?: CRNSpecs
}

export type UseSelectInstanceSpecsReturn = {
  specsCtrl: UseControllerReturn<any, any>
  options: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.Program
  isPersistent: boolean
  paymentMethod: PaymentMethod
  nodeSpecs?: CRNSpecs
}

export function validateMinNodeSpecs(
  minSpecs: InstanceSpecsField,
  nodeSpecs: CRNSpecs,
): boolean {
  return (
    minSpecs.cpu <= nodeSpecs.cpu.count &&
    minSpecs.ram <= (nodeSpecs.mem.available_kB || 0) / 1024 &&
    minSpecs.storage <= (nodeSpecs.disk.available_kB || 0) / 1024
  )
}

export function useSelectInstanceSpecs({
  name = 'specs',
  control,
  defaultValue,
  type,
  options: optionsProp,
  isPersistent = false,
  paymentMethod = PaymentMethod.Hold,
  nodeSpecs,
  ...rest
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const options = useMemo(() => {
    const opts = optionsProp || getDefaultSpecsOptions(isPersistent)
    if (paymentMethod === PaymentMethod.Hold) return opts
    if (!nodeSpecs) return []
    return opts.filter((opt) => validateMinNodeSpecs(opt, nodeSpecs))
  }, [optionsProp, isPersistent, paymentMethod, nodeSpecs])

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
    paymentMethod,
    ...rest,
  }
}
