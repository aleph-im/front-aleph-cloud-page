import { CRNSpecs, ReducedCRNSpecs } from '@/domain/node'
import { EntityType } from '@/helpers/constants'
import { convertByteUnits } from '@/helpers/utils'
import { useCallback, useEffect, useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { Tier, useDefaultTiers } from '../common/pricing/useDefaultTiers'
import { useAccountVouchers } from '../common/useAccountVouchers'
import { useNodeManager } from '../common/useManager/useNodeManager'

export type InstanceSpecsField = ReducedCRNSpecs & {
  disabled?: boolean
  disabledReason?: string
}

export function updateSpecsStorage(
  specs: InstanceSpecsField,
  isPersistent = true,
): InstanceSpecsField {
  return {
    ...specs,
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
  nodeSpecs?: CRNSpecs
}

export type UseSelectInstanceSpecsReturn = {
  specsCtrl: UseControllerReturn<any, any>
  options: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.GpuInstance | EntityType.Program
  isPersistent: boolean
  nodeSpecs?: CRNSpecs
  showOpenClawSpotlight?: boolean
}

export function useSelectInstanceSpecs({
  name = 'specs',
  control,
  defaultValue,
  type,
  gpuModel,
  isPersistent = false,
  nodeSpecs,
  ...rest
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const nodeManager = useNodeManager()

  const { defaultTiers } = useDefaultTiers({ type, gpuModel })
  const { vouchers } = useAccountVouchers()

  const filterValidNodeSpecs = useCallback(
    (option: Tier) => {
      if (type === EntityType.Program) return true
      if (!nodeSpecs) return false

      return nodeManager.validateMinNodeSpecs(option, nodeSpecs)
    },
    [nodeManager, nodeSpecs, type],
  )

  // Process and cache valid voucher configurations
  const validVoucherConfigs = useMemo(() => {
    if (!vouchers.length) return null

    // Build a map of valid CPU/RAM configurations based on vouchers
    const validConfigs = new Map<string, boolean>()

    vouchers.forEach((voucher) => {
      const maxCPU = voucher.attributes.find(
        (attr) => attr.traitType === 'Max vCPU Cores',
      )

      const maxRam = voucher.attributes.find(
        (attr) => attr.traitType === 'Max RAM (GB)',
      )

      if (!maxCPU && !maxRam) return

      // Get max values
      const cpuLimit = maxCPU ? +maxCPU.value : Infinity
      const ramLimitGB = maxRam ? +maxRam.value : Infinity

      // Store valid configurations as CPU-RAM pairs
      for (let cpu = 1; cpu <= cpuLimit; cpu++) {
        for (let ramGB = 1; ramGB <= ramLimitGB; ramGB++) {
          const ramMiB = convertByteUnits(ramGB, { from: 'GiB', to: 'MiB' })
          const key = `${cpu}-${ramMiB}`
          validConfigs.set(key, true)
        }
      }
    })

    return validConfigs
  }, [vouchers])

  const enableTiersWithVouchers = useCallback(
    (option: Tier) => {
      if (!option.disabled) return option
      if (!validVoucherConfigs) return option

      const configKey = `${option.cpu}-${option.ram}`

      // Check if this CPU/RAM configuration is valid according to vouchers
      const isEnabledByVoucher = validVoucherConfigs.has(configKey)

      return isEnabledByVoucher
        ? {
            ...option,
            disabled: false,
            disabledReason: undefined,
          }
        : option
    },
    [validVoucherConfigs],
  )

  const options = useMemo(() => {
    return defaultTiers
      .filter(filterValidNodeSpecs)
      .map(enableTiersWithVouchers)
  }, [defaultTiers, filterValidNodeSpecs, enableTiersWithVouchers])

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
    // 4. Current selected tier is not compatible with the selected node
    const shouldAutoSelect =
      !value ||
      !valueOption ||
      valueOption.disabled ||
      (nodeSpecs && !nodeManager.validateMinNodeSpecs(value, nodeSpecs))

    if (shouldAutoSelect) {
      const firstAvailableTier = options[0]
      onChange(updateSpecsStorage(firstAvailableTier, isPersistent))
    }
  }, [options, nodeSpecs, isPersistent, value, onChange, nodeManager])

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
    ...rest,
  }
}
