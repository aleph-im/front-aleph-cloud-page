import { useMemo } from 'react'
import { CRNSpecs } from '@/domain/node'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { useCostManager } from './useManager/useCostManager'
import { useLocalRequest } from '@aleph-front/core'
import { compareVersion } from '@/helpers/utils'
import { useStableValue } from './useStableValue'

export type AggregatedNodeSpecs = {
  maxCpu: number
  maxRamKB: number
  maxDiskKB: number
  gpuModels: string[]
}

export type UseAggregatedNodeSpecsReturn = {
  aggregatedSpecs: AggregatedNodeSpecs | undefined
  validNodes: CRNSpecs[]
  loading: boolean
}

export function useAggregatedNodeSpecs(): UseAggregatedNodeSpecsReturn {
  const { specs: crnSpecs, loading: isLoadingSpecs } = useRequestCRNSpecs()
  const costManager = useCostManager()

  const { data: settingsAggregate, loading: isLoadingSettings } =
    useLocalRequest({
      doRequest: () => {
        return costManager
          ? costManager.getSettingsAggregate()
          : Promise.resolve(undefined)
      },
      onSuccess: () => null,
      onError: () => null,
      flushData: true,
      triggerOnMount: true,
      triggerDeps: [costManager],
    })

  const loading = isLoadingSpecs || isLoadingSettings

  // Extract all CRN specs from the RequestState objects
  const allNodes = useMemo(() => {
    return Object.values(crnSpecs)
      .map((spec) => spec.data)
      .filter(Boolean) as CRNSpecs[]
  }, [crnSpecs])

  // Filter valid nodes (IPV6 check, version requirements)
  const filteredNodes = useMemo(() => {
    if (!settingsAggregate?.lastCrnVersion) return []

    const minVersion = settingsAggregate.lastCrnVersion

    return allNodes.filter((node) => {
      // Check IPV6 support
      // @note: Backend sometimes returns `result` instead of `vm`
      const hasValidIPV6 =
        node.ipv6_check?.vm || node.ipv6_check?.result || false
      if (!hasValidIPV6) return false

      // Check version requirements
      const nodeVersion = node.version || ''
      if (!nodeVersion) return false
      if (!compareVersion(nodeVersion, minVersion)) return false

      // Check basic specs exist
      if (
        !node.cpu?.count ||
        !node.mem?.available_kB ||
        !node.disk?.available_kB
      )
        return false

      return true
    })
  }, [allNodes, settingsAggregate])

  // Stabilize validNodes to prevent infinite loops - only update when node hashes change
  const validNodesKey = filteredNodes.map((n) => n.hash).join(',')
  const validNodes = useStableValue(filteredNodes, validNodesKey)

  // Compute aggregated (max) specs across all valid nodes
  const aggregatedSpecs = useMemo(() => {
    if (validNodes.length === 0) return undefined

    const gpuModelsSet = new Set<string>()

    const result = validNodes.reduce(
      (acc, node) => {
        acc.maxCpu = Math.max(acc.maxCpu, node.cpu?.count || 0)
        acc.maxRamKB = Math.max(acc.maxRamKB, node.mem?.available_kB || 0)
        acc.maxDiskKB = Math.max(acc.maxDiskKB, node.disk?.available_kB || 0)

        // Collect GPU models
        node.compatible_available_gpus?.forEach((gpu) => {
          if (gpu.model) gpuModelsSet.add(gpu.model)
        })

        return acc
      },
      {
        maxCpu: 0,
        maxRamKB: 0,
        maxDiskKB: 0,
        gpuModels: [] as string[],
      },
    )

    result.gpuModels = Array.from(gpuModelsSet).sort()

    return result
  }, [validNodes])

  return {
    aggregatedSpecs,
    validNodes,
    loading,
  }
}
