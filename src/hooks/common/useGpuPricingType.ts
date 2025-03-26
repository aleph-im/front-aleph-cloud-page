import { PriceType } from '@/domain/cost'
import { GPUDevice } from '@/domain/node'
import { useLocalRequest } from '@aleph-front/core'
import { useMemo } from 'react'
import { useCostManager } from './useManager/useCostManager'

export type UseGpuPricingTypeProps = {
  gpuDevice?: GPUDevice
}

export type UseGpuPricingTypeReturn = {
  loading: boolean
  error?: Error
  priceType: PriceType
}

/**
 * Hook to determine if a GPU is premium or standard based on the settings aggregate
 * and return the appropriate pricing type.
 */
export function useGpuPricingType({
  gpuDevice,
}: UseGpuPricingTypeProps): UseGpuPricingTypeReturn {
  const costManager = useCostManager()

  // Fetch settings aggregate to check if the GPU is premium
  const { data: settingsAggregate, loading, error } = useLocalRequest({
    doRequest: () => costManager?.getSettingsAggregate(),
    onSuccess: () => null,
    flushData: true,
    triggerOnMount: true,
    triggerDeps: [costManager, gpuDevice],
  })

  // Determine if the GPU is premium and set the appropriate price type
  const priceType = useMemo(() => {
    if (!gpuDevice || !settingsAggregate) {
      return PriceType.InstanceGpuStandard
    }

    // Check if the selected GPU is in the list of premium GPUs
    const isPremiumGpu = settingsAggregate.compatibleGpus?.some(
      (gpu) => 
        gpu.model === gpuDevice.model && 
        gpu.vendor === gpuDevice.vendor
    )

    return isPremiumGpu 
      ? PriceType.InstanceGpuPremium 
      : PriceType.InstanceGpuStandard
  }, [gpuDevice, settingsAggregate])

  return {
    loading,
    error,
    priceType,
  }
}