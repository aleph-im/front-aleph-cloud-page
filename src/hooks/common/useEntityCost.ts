import { useEffect, useState } from 'react'
import { InstanceCostProps } from '@/domain/instance'
import { ProgramCostProps } from '@/domain/program'
import { VolumeCostProps } from '@/domain/volume'
import { EntityType } from '@/helpers/constants'
import { IndexerCostProps, IndexerManager } from '@/domain/indexer'
import { WebsiteCostProps, WebsiteManager } from '@/domain/website'
import { useVolumeManager } from './useManager/useVolumeManager'
import { useProgramManager } from './useManager/useProgramManager'
import { useInstanceManager } from './useManager/useInstanceManager'
import { CostSummary } from '@/domain/cost'

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

export type UseIndexerCostProps = {
  entityType: EntityType.Indexer
  props: IndexerCostProps
}

export type UseWebsiteCostProps = {
  entityType: EntityType.Website
  props: WebsiteCostProps
}

export type UseEntityCostProps =
  | UseVolumeCostProps
  | UseInstanceCostProps
  | UseProgramCostProps
  | UseIndexerCostProps
  | UseWebsiteCostProps

export type UseEntityCostReturn = CostSummary

export function useEntityCost({
  entityType,
  props,
}: UseEntityCostProps): UseEntityCostReturn {
  const [cost, setCost] = useState<UseEntityCostReturn>()

  const volumeManager = useVolumeManager()
  const instanceManager = useInstanceManager()
  const programManager = useProgramManager()

  useEffect(() => {
    async function load() {
      let result

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
        case EntityType.Indexer:
          result = await IndexerManager.getCost(props)
          break
        case EntityType.Website:
          result = await WebsiteManager.getCost(props)
          break
        default:
          result = undefined
      }

      console.log('LOAD COSTS', result)

      setCost(result)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, ...Object.values(props)])

  return cost
}
