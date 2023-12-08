import { useEffect, useState } from 'react'
import {
  InstanceCost,
  InstanceCostProps,
  InstanceManager,
} from '@/domain/instance'
import { ProgramCost, ProgramCostProps, ProgramManager } from '@/domain/program'
import { VolumeCost, VolumeCostProps, VolumeManager } from '@/domain/volume'
import { EntityType } from '@/helpers/constants'
import { IndexerCostProps, IndexerManager } from '@/domain/indexer'

export type UseEntityCostProps = {
  entityType: EntityType
  props:
    | VolumeCostProps
    | InstanceCostProps
    | ProgramCostProps
    | IndexerCostProps
}

export type UseEntityCostReturn = {
  cost: VolumeCost | InstanceCost | ProgramCost | IndexerCostProps
}

export function useEntityCost({ entityType, props }: UseEntityCostProps) {
  const [cost, setCost] = useState<VolumeCost | InstanceCost | ProgramCost>()

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
        : undefined)

      setCost(result)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, ...Object.values(props)])

  return { cost }
}
