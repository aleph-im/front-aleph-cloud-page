import { CRNSpecs, ReducedCRNSpecs } from '@/domain/node'
import { EntityType } from '@/helpers/constants'
import { convertByteUnits } from '@/helpers/utils'
import { useCallback, useEffect, useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { Tier, useDefaultTiers } from '../common/pricing/useDefaultTiers'
import { useAccountVouchers } from '../common/useAccountVouchers'
import { AggregatedNodeSpecs } from '../common/useAggregatedNodeSpecs'

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
  aggregatedSpecs?: AggregatedNodeSpecs
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
  aggregatedSpecs,
  ...rest
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const { defaultTiers } = useDefaultTiers({ type, gpuModel })
  const { vouchers } = useAccountVouchers()

  // Filter tiers based on aggregated specs (union of all available nodes)
  // This allows users to see all tiers that ANY node can support
  const filterValidAggregatedSpecs = useCallback(
    (option: Tier) => {
      if (type === EntityType.Program) return true

      // If we have aggregated specs, use them to filter tiers
      if (aggregatedSpecs) {
        const ramMB = option.ram
        const storageMB = option.storage

        return (
          option.cpu <= aggregatedSpecs.maxCpu &&
          ramMB <= aggregatedSpecs.maxRamKB / 1024 &&
          storageMB <= aggregatedSpecs.maxDiskKB / 1024
        )
      }

      // Fallback: if no aggregated specs yet, show all tiers
      // (loading state - tiers will be filtered once specs load)
      return true
    },
    [aggregatedSpecs, type],
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
      .filter(filterValidAggregatedSpecs)
      .map(enableTiersWithVouchers)
  }, [defaultTiers, filterValidAggregatedSpecs, enableTiersWithVouchers])

  const specsCtrl = useController({
    control,
    name,
    defaultValue,
  })

  const { value, onChange } = specsCtrl.field

  // Auto select first available tier when options change
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
    const shouldAutoSelect = !value || !valueOption || valueOption.disabled

    if (shouldAutoSelect) {
      const firstAvailableTier = options[0]
      onChange(updateSpecsStorage(firstAvailableTier, isPersistent))
    }
  }, [options, isPersistent, value, onChange])

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
