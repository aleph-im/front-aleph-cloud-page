import { ReducedCRNSpecs } from '@/domain/node'
import { useMemo } from 'react'
import useFetchPricingAggregate from '../useFetchPricingAggregate'

export type Tier = ReducedCRNSpecs & {
  disabled?: boolean
}

export type UseDefaultTiersProps = {
  type: 'program' | 'instance'
}

export type UseDefaultTiersReturn = {
  defaultTiers: Tier[]
}

export const DEFAULT_TIERS: { program: Tier[]; instance: Tier[] } = {
  program: [{ cpu: 1, ram: 2048, storage: 20480, disabled: false }],
  instance: [{ cpu: 1, ram: 2048, storage: 20480, disabled: false }],
}

export function useDefaultTiers({
  type,
}: UseDefaultTiersProps): UseDefaultTiersReturn {
  const { loading: loadingPricingAggregate, pricingAggregate } =
    useFetchPricingAggregate()

  const defaultTiers = useMemo(() => {
    if (loadingPricingAggregate) return DEFAULT_TIERS[type]
    if (!pricingAggregate) return DEFAULT_TIERS[type]

    const { computeUnit, tiers } = pricingAggregate[type]

    return tiers.map(({ computeUnits }) => ({
      cpu: computeUnit.vcpus * computeUnits,
      ram: computeUnit.memoryMib * computeUnits,
      storage: computeUnit.diskMib * computeUnits,
      disabled: false,
    }))
  }, [loadingPricingAggregate, pricingAggregate, type])

  return { defaultTiers }
}
