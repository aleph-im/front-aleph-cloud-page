import { ReducedCRNSpecs } from '@/domain/node'
import { useMemo } from 'react'
import useFetchPricingAggregate from './useFetchPricingAggregate'
import { EntityType } from '@/helpers/constants'
import Err from '@/helpers/errors'
import { PriceType } from '@/domain/cost'

export type Tier = ReducedCRNSpecs & {
  disabled?: boolean
}

export type UseDefaultTiersProps =
  | {
      type: EntityType.Instance | EntityType.Program
      gpuModel?: undefined
    }
  | {
      type: EntityType.GpuInstance
      gpuModel?: string
    }

export type UseDefaultTiersReturn = {
  defaultTiers: Tier[]
}

export const DEFAULT_TIERS: {
  program: Tier[]
  instance: Tier[]
  gpuInstance: Tier[]
} = {
  program: [{ cpu: 1, ram: 2048, storage: 20480, disabled: false }],
  instance: [{ cpu: 1, ram: 2048, storage: 20480, disabled: false }],
  gpuInstance: [{ cpu: 3, ram: 3 * 6144, storage: 3 * 61440, disabled: false }],
}

export function useDefaultTiers({
  type,
  gpuModel,
}: UseDefaultTiersProps): UseDefaultTiersReturn {
  const { loading: loadingPricingAggregate, pricingAggregate } =
    useFetchPricingAggregate()

  const defaultTiers = useMemo(() => {
    // @todo: Refactor and show a loading spinner state instead
    if (loadingPricingAggregate) return DEFAULT_TIERS[type]
    if (!pricingAggregate) return DEFAULT_TIERS[type]

    // Find the tiers for the GPU model whether it is standard or premium GPU
    if (type === EntityType.GpuInstance) {
      if (!gpuModel) return DEFAULT_TIERS[type]

      const tiers: Tier[] = []

      pricingAggregate[PriceType.InstanceGpuStandard].tiers.forEach((tier) => {
        const { model, computeUnits } = tier

        if (model === gpuModel) {
          const { computeUnit } =
            pricingAggregate[PriceType.InstanceGpuStandard]

          tiers.push({
            cpu: computeUnit.vcpus * computeUnits,
            ram: computeUnit.memoryMib * computeUnits,
            storage: computeUnit.diskMib * computeUnits,
            disabled: false,
          })
        }
      })

      pricingAggregate[PriceType.InstanceGpuPremium].tiers.forEach((tier) => {
        const { model, computeUnits } = tier

        if (model === gpuModel) {
          const { computeUnit } = pricingAggregate[PriceType.InstanceGpuPremium]

          tiers.push({
            cpu: computeUnit.vcpus * computeUnits,
            ram: computeUnit.memoryMib * computeUnits,
            storage: computeUnit.diskMib * computeUnits,
            disabled: false,
          })
        }
      })

      if (!tiers.length) throw Err.UnsuportedGPUModel(gpuModel)

      return tiers
    } else {
      const { computeUnit, tiers } = pricingAggregate[type]

      return tiers.map(({ computeUnits }) => ({
        cpu: computeUnit.vcpus * computeUnits,
        ram: computeUnit.memoryMib * computeUnits,
        storage: computeUnit.diskMib * computeUnits,
        disabled: false,
      }))
    }
  }, [loadingPricingAggregate, pricingAggregate, type, gpuModel])

  return { defaultTiers }
}
