import { CRNSpecs, ReducedCRNSpecs } from '@/domain/node'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { convertByteUnits } from '@/helpers/utils'
import { useCallback, useEffect, useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { Tier, useDefaultTiers } from '../common/pricing/useDefaultTiers'
import { useAppState } from '@/contexts/appState'
import { useAccountVouchers } from '../common/useAccountVouchers'

export type InstanceSpecsField = ReducedCRNSpecs & {
  disabled?: boolean
  disabledReason?: string
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
  const [state] = useAppState()
  const {
    manager: { nodeManager },
  } = state

  const { defaultTiers } = useDefaultTiers({ type, gpuModel })
  const { vouchers } = useAccountVouchers()

  const filterValidNodeSpecs = useCallback(
    (option: Tier) => {
      if (paymentMethod === PaymentMethod.Hold) return option
      if (!nodeSpecs) return false

      return nodeManager.validateMinNodeSpecs(option, nodeSpecs)
    },
    [nodeManager, nodeSpecs, paymentMethod],
  )

  const disableHighTiersForHolding = useCallback(
    (option: Tier) => {
      if (paymentMethod !== PaymentMethod.Hold) return option
      if (option.cpu <= 4) return option

      return {
        ...option,
        disabled: true,
        disabledReason: 'High tiers are only avaiable for Pay-as-you-go.',
      }
    },
    [paymentMethod],
  )

  const enableTiersWithVouchers = useCallback(
    (option: Tier) => {
      if (!option.disabled) return option
      if (!vouchers.length) return option

      console.log('vouchers', vouchers)
      let enableOption = false

      vouchers.some((voucher) => {
        const maxCPU = voucher.attributes.find(
          (attr) => attr.traitType === 'Max vCPU Cores',
        )

        const maxRam = voucher.attributes.find(
          (attr) => attr.traitType === 'Max RAM (GB)',
        )

        if (!maxCPU && !maxRam) return false
        enableOption = true

        if (maxCPU) {
          enableOption =
            +maxCPU.value >= option.cpu ? enableOption && true : false
        }

        if (maxRam) {
          enableOption =
            +maxRam.value >=
            convertByteUnits(option.ram, { from: 'MiB', to: 'GiB' })
              ? enableOption && true
              : false
        }
      })

      return enableOption
        ? {
            ...option,
            disabled: false,
            disabledReason: undefined,
          }
        : option
    },
    [vouchers],
  )

  const options = useMemo(() => {
    return defaultTiers
      .filter(filterValidNodeSpecs)
      .map(disableHighTiersForHolding)
      .map(enableTiersWithVouchers)
  }, [
    defaultTiers,
    filterValidNodeSpecs,
    disableHighTiersForHolding,
    enableTiersWithVouchers,
  ])

  const specsCtrl = useController({
    control,
    name,
    defaultValue,
  })

  const { value, onChange } = specsCtrl.field

  // Auto select first available tier
  useEffect(() => {
    if (!options.length) return

    // Find the matching option for the current value
    const valueOption = !value
      ? undefined
      : options.find(
          (opt) =>
            opt.cpu === value?.cpu &&
            opt.ram === value?.ram &&
            opt.storage === value?.storage,
        )

    // General cases when we should auto-select first available tier:
    // 1. No tier is selected yet
    // 2. Current selected tier is disabled
    // 3. Current selected tier is not in the options anymore
    let shouldAutoSelect = !value || !valueOption || valueOption.disabled

    if (paymentMethod === PaymentMethod.Stream && !shouldAutoSelect) {
      if (!nodeSpecs) return
      // Cases when we should auto-select first available tier for PAYG:
      // 1. Current selected tier is not compatible with the node

      shouldAutoSelect = !nodeManager.validateMinNodeSpecs(value, nodeSpecs)
    }

    if (shouldAutoSelect) {
      const firstAvailableTier = options[0]
      onChange(
        updateSpecsStorage(firstAvailableTier, isPersistent, paymentMethod),
      )
    }
  }, [
    options,
    nodeSpecs,
    paymentMethod,
    isPersistent,
    value,
    onChange,
    nodeManager,
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
