import { useEffect, useState } from 'react'
import {
  InstanceCost,
  InstanceCostProps,
  InstanceManager,
} from '@/domain/instance'
import { ProgramCost, ProgramCostProps, ProgramManager } from '@/domain/program'
import { VolumeCost, VolumeCostProps, VolumeManager } from '@/domain/volume'
import { EntityType } from '@/helpers/constants'
import { WebsiteCost, WebsiteCostProps, WebsiteManager } from '@/domain/website'

export type UseEntityCostProps = {
  entityType: EntityType
  props:
    | Partial<VolumeCostProps>
    | Partial<InstanceCostProps>
    | Partial<ProgramCostProps>
    | Partial<WebsiteCostProps>
}

export type UseEntityCostReturn = {
  cost: VolumeCost | InstanceCost | ProgramCost | WebsiteCost
}

export function useEntityCost({ entityType, props }: UseEntityCostProps) {
  const [cost, setCost] = useState<UseEntityCostReturn['cost']>()

  useEffect(() => {
    async function load() {
      let result

      switch (entityType) {
        case EntityType.Volume:
          result = await VolumeManager.getCost(props as VolumeCostProps)
          break
        case EntityType.Instance:
          result = await InstanceManager.getCost(props as InstanceCostProps)
          break
        case EntityType.Program:
          result = await ProgramManager.getCost(props as ProgramCostProps)
          break
        case EntityType.Website:
          result = await WebsiteManager.getCost(props as WebsiteCostProps)
          break
        default:
          result = undefined
      }

      setCost(result)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, ...Object.values(props)])

  return { cost }
}
