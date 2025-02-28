import { CRNSpecs, ReducedCRNSpecs } from '@/domain/node'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { convertByteUnits } from '@/helpers/utils'
import { useEffect, useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { useNodeManager } from '../common/useManager/useNodeManager'
import { useDefaultTiers } from '../common/pricing/tiers/useDefaultTiers'

export type InstanceSpecsField = ReducedCRNSpecs & {
  disabled?: boolean
}

export function updateSpecsStorage(
  specs: InstanceSpecsField,
  isPersistent = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  paymentMethod: PaymentMethod = PaymentMethod.Hold,
): InstanceSpecsField {
  return {
    ...specs,
    // @todo: Reactivate it for Stream once that it is supported on backend
    // disabled: paymentMethod !== PaymentMethod.Stream && isPersistent && specs.cpu >= 6,
    disabled: false,
    storage: convertByteUnits(specs.cpu * 2 * (isPersistent ? 10 : 1), {
      from: 'GiB',
      to: 'MiB',
    }),
  }
}

export type UseSelectInstanceSpecsProps = {
  name?: string
  control: Control
  defaultValue?: InstanceSpecsField
  type: EntityType.Instance | EntityType.GpuInstance | EntityType.Program
  gpuModel?: string
  isPersistent?: boolean
  paymentMethod?: PaymentMethod
  nodeSpecs?: CRNSpecs
}

export type UseSelectInstanceSpecsReturn = {
  specsCtrl: UseControllerReturn<any, any>
  options: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.GpuInstance | EntityType.Program
  isPersistent: boolean
  paymentMethod: PaymentMethod
  nodeSpecs?: CRNSpecs
}

export function useSelectInstanceSpecs({
  name = 'specs',
  control,
  defaultValue,
  type,
  gpuModel,
  isPersistent = false,
  paymentMethod = PaymentMethod.Hold,
  nodeSpecs,
  ...rest
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const manager = useNodeManager()
  const { defaultTiers } = useDefaultTiers({ type, gpuModel })

  const options = useMemo(() => {
    if (paymentMethod === PaymentMethod.Hold) return defaultTiers
    if (!nodeSpecs) return []

    return defaultTiers.filter((opt) =>
      manager.validateMinNodeSpecs(opt, nodeSpecs),
    )
  }, [defaultTiers, paymentMethod, nodeSpecs, manager])

  const specsCtrl = useController({
    control,
    name,
    defaultValue,
  })

  const { value, onChange } = specsCtrl.field

  useEffect(() => {
    if (!value) return

    let updatedSpecs = updateSpecsStorage(value, isPersistent, paymentMethod)
    if (updatedSpecs.storage === value.storage) return

    if (updatedSpecs.disabled) {
      updatedSpecs = options[0]
    }

    onChange(updatedSpecs)
  }, [isPersistent, value, onChange, options, paymentMethod])

  return {
    specsCtrl,
    options,
    type,
    isPersistent,
    paymentMethod,
    ...rest,
  }
}
