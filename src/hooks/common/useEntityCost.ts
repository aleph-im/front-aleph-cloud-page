import { useEffect, useState } from 'react'
import { InstanceCostProps } from '@/domain/instance'
import { ProgramCostProps } from '@/domain/program'
import { VolumeCostProps } from '@/domain/volume'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { WebsiteCostProps } from '@/domain/website'
import { useVolumeManager } from './useManager/useVolumeManager'
import { useProgramManager } from './useManager/useProgramManager'
import { useInstanceManager } from './useManager/useInstanceManager'
import { CostSummary } from '@/domain/cost'
import { useWebsiteManager } from './useManager/useWebsiteManager'

export type UseVolumeCostProps = {
  entityType: EntityType.Volume
  props: VolumeCostProps
}

export type UseInstanceCostProps = {
  entityType: EntityType.Instance
  props: InstanceCostProps
}

export type UseProgramCostProps = {
  entityType: EntityType.Program
  props: ProgramCostProps
}

export type UseWebsiteCostProps = {
  entityType: EntityType.Website
  props: WebsiteCostProps
}

export type UseEntityCostProps =
  | UseVolumeCostProps
  | UseInstanceCostProps
  | UseProgramCostProps
  | UseWebsiteCostProps

export type UseEntityCostReturn = CostSummary

export function useEntityCost({
  entityType,
  props,
}: UseEntityCostProps): UseEntityCostReturn {
  const emptyCost = {
    paymentMethod: PaymentMethod.Hold,
    cost: Number.POSITIVE_INFINITY,
    lines: [],
  }
  const [cost, setCost] = useState<UseEntityCostReturn>(emptyCost)

  const volumeManager = useVolumeManager()
  const instanceManager = useInstanceManager()
  const programManager = useProgramManager()
  const websiteManager = useWebsiteManager()

  useEffect(() => {
    async function load() {
      let result: CostSummary = emptyCost

      switch (entityType) {
        case EntityType.Volume:
          if (volumeManager) result = await volumeManager.getCost(props)
          break
        case EntityType.Instance:
          if (instanceManager) result = await instanceManager.getCost(props)
          break
        case EntityType.Program:
          if (programManager) result = await programManager.getCost(props)
          break
        case EntityType.Website:
          if (websiteManager) result = await websiteManager.getCost(props)
          break
      }

      console.log('LOAD COSTS', result)

      setCost(result)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, ...Object.values(props)])

  return cost
}
