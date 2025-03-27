import { useEffect, useState, useMemo } from 'react'
import usePrevious from './usePrevious'
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
import { GpuInstanceCostProps } from '@/domain/gpuInstance'
import { useGpuInstanceManager } from './useManager/useGpuInstanceManager'
import { useDebounceState } from '@aleph-front/core'

export type UseVolumeCostProps = {
  entityType: EntityType.Volume
  props: VolumeCostProps
}

export type UseGpuInstanceCostProps = {
  entityType: EntityType.GpuInstance
  props: GpuInstanceCostProps
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
  | UseGpuInstanceCostProps
  | UseProgramCostProps
  | UseWebsiteCostProps

export type UseEntityCostReturn = CostSummary

export function useEntityCost(props: UseEntityCostProps): UseEntityCostReturn {
  // Use useMemo to prevent the object from being recreated on every render
  const emptyCost = useMemo(
    () => ({
      paymentMethod: PaymentMethod.Hold,
      cost: Number.POSITIVE_INFINITY,
      lines: [],
    }),
    [],
  )

  const [cost, setCost] = useState<UseEntityCostReturn>(emptyCost)

  const volumeManager = useVolumeManager()
  const instanceManager = useInstanceManager()
  const gpuInstanceManager = useGpuInstanceManager()
  const programManager = useProgramManager()
  const websiteManager = useWebsiteManager()

  // Create a string representation of the props for change detection only
  const propsString = useMemo(() => JSON.stringify(props), [props])

  // Debounce the string representation with a 1000ms (1 second) delay
  const debouncedPropsString = useDebounceState(propsString, 1000)

  // Store previous debounced string to detect changes
  const prevDebouncedPropsString = usePrevious(debouncedPropsString)

  // Return the original props only when the debounced string changes
  const debouncedProps = useMemo(() => {
    // Check if the debounced string has changed
    if (
      debouncedPropsString !== prevDebouncedPropsString &&
      debouncedPropsString
    ) {
      return { ...props } // Return the original props (with File instances intact)
    }
  }, [debouncedPropsString, prevDebouncedPropsString, props])

  // Only make the API call when the debounced props change
  useEffect(() => {
    async function load() {
      // Skip if debouncedProps is undefined (no change detected)
      if (!debouncedProps) return

      let result: CostSummary = emptyCost
      const { entityType, props } = debouncedProps

      switch (entityType) {
        case EntityType.Volume:
          if (volumeManager) result = await volumeManager.getCost(props)
          break
        case EntityType.Instance:
          if (instanceManager) result = await instanceManager.getCost(props)
          break
        case EntityType.GpuInstance:
          if (gpuInstanceManager)
            result = await gpuInstanceManager.getCost(props)
          break
        case EntityType.Program:
          if (programManager) result = await programManager.getCost(props)
          break
        case EntityType.Website:
          if (websiteManager) result = await websiteManager.getCost(props)
          break
      }

      setCost(result)
    }

    load()
  }, [
    debouncedProps,
    emptyCost,
    volumeManager,
    instanceManager,
    gpuInstanceManager,
    programManager,
    websiteManager,
  ])

  return cost
}
