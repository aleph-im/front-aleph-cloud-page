import { useEffect, useState } from 'react'
import {
  InstanceCost,
  InstanceCostProps,
  InstanceManager,
} from '@/domain/instance'
import { ProgramCost, ProgramCostProps, ProgramManager } from '@/domain/program'
import { VolumeCost, VolumeCostProps, VolumeManager } from '@/domain/volume'
import { EntityType } from '@/helpers/constants'
import { IndexerCost, IndexerCostProps, IndexerManager } from '@/domain/indexer'
import { WebsiteCost, WebsiteCostProps, WebsiteManager } from '@/domain/website'

export type UseEntityCostProps = {
  entityType: EntityType
  props:
    | Partial<VolumeCostProps>
    | Partial<InstanceCostProps>
    | Partial<ProgramCostProps>
    | Partial<IndexerCostProps>
    | Partial<WebsiteCostProps>
}

export type UseEntityCostReturn = {
  cost: VolumeCost | InstanceCost | ProgramCost | IndexerCost | WebsiteCost
}

export function useEntityCost({ entityType, props }: UseEntityCostProps) {
  const [cost, setCost] = useState<UseEntityCostReturn['cost']>()

  useEffect(() => {
    async function load() {
      const result = await (entityType === EntityType.Volume
        ? VolumeManager.getCost(props as VolumeCostProps)
        : entityType === EntityType.Instance
          ? InstanceManager.getCost(props as InstanceCostProps)
          : entityType === EntityType.Program
            ? ProgramManager.getCost(props as ProgramCostProps)
            : entityType === EntityType.Indexer
              ? IndexerManager.getCost(props as IndexerCostProps)
              : entityType === EntityType.Website
                ? WebsiteManager.getCost(props as WebsiteCostProps)
                : undefined)

      setCost(result)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, ...Object.values(props)])

  return { cost }
}
