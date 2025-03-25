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

  // Auto select first available tier when CRN node is selected in PAYG mode
  useEffect(() => {
    // Only apply for PAYG payment method when we have valid options and node specs
    if (
      paymentMethod === PaymentMethod.Stream &&
      nodeSpecs &&
      options.length > 0
    ) {
      // Cases when we should auto-select first available tier:
      // 1. No tier is selected yet
      // 2. Current selected tier is not compatible with the node
      // 3. When options change (e.g., after changing the CRN node) and current selection isn't in the new options
      const shouldAutoSelect =
        !value ||
        (nodeSpecs && !manager.validateMinNodeSpecs(value, nodeSpecs)) ||
        !options.some((opt) => opt.cpu === value?.cpu && opt.ram === value?.ram)

      if (shouldAutoSelect) {
        const firstAvailableTier = options[0]
        onChange(
          updateSpecsStorage(firstAvailableTier, isPersistent, paymentMethod),
        )
      }
    }
  }, [
    options,
    nodeSpecs,
    paymentMethod,
    isPersistent,
    value,
    onChange,
    manager,
  ])

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
