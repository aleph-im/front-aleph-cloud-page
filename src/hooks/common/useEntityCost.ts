import { useEffect, useState, useMemo } from 'react'
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

export function useEntityCost({
  entityType,
  props,
}: UseEntityCostProps): UseEntityCostReturn {
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

  // Create a string representation of the props to detect changes
  const propsString = useMemo(() => JSON.stringify(props), [props])

  // Debounce the string representation with a 1000ms (1 second) delay
  const debouncedPropsString = useDebounceState(propsString, 1000)

  // Parse the debounced props string back to an object when it changes
  const debouncedProps = useMemo(() => {
    try {
      return JSON.parse(debouncedPropsString)
    } catch (e) {
      // Return empty object if parsing fails (e.g., on first render with empty string)
      return {}
    }
  }, [debouncedPropsString])

  // Only make the API call when the debounced props change
  useEffect(() => {
    // Skip initial render or invalid props
    if (!debouncedProps || Object.keys(debouncedProps).length === 0) return

    async function load() {
      let result: CostSummary = emptyCost

      switch (entityType) {
        case EntityType.Volume:
          if (volumeManager)
            result = await volumeManager.getCost(debouncedProps)
          break
        case EntityType.Instance:
          if (instanceManager)
            result = await instanceManager.getCost(debouncedProps)
          break
        case EntityType.GpuInstance:
          if (gpuInstanceManager)
            result = await gpuInstanceManager.getCost(debouncedProps)
          break
        case EntityType.Program:
          if (programManager)
            result = await programManager.getCost(debouncedProps)
          break
        case EntityType.Website:
          if (websiteManager)
            result = await websiteManager.getCost(debouncedProps)
          break
      }

      setCost(result)
    }

    load()
  }, [
    entityType,
    debouncedProps, // Use the parsed debounced props object
    emptyCost,
    volumeManager,
    instanceManager,
    gpuInstanceManager,
    programManager,
    websiteManager,
  ])

  return cost
}
