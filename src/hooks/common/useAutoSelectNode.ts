import { useMemo } from 'react'
import { CRNSpecs, NodeManager, ReducedCRNSpecs } from '@/domain/node'

export type UseAutoSelectNodeProps = {
  selectedSpecs: ReducedCRNSpecs | undefined
  validNodes: CRNSpecs[]
  gpuModel?: string
  enabled?: boolean
}

export type UseAutoSelectNodeReturn = {
  autoSelectedNode: CRNSpecs | undefined
  compatibleNodes: CRNSpecs[]
}

export function useAutoSelectNode({
  selectedSpecs,
  validNodes,
  gpuModel,
  enabled = true,
}: UseAutoSelectNodeProps): UseAutoSelectNodeReturn {
  // Filter nodes that can support the selected tier
  const compatibleNodes = useMemo(() => {
    if (!selectedSpecs) return []
    if (!validNodes.length) return []

    let nodes = validNodes.filter((node) =>
      NodeManager.validateMinNodeSpecs(selectedSpecs, node),
    )

    // For GPU instances, also filter by GPU model
    if (gpuModel) {
      nodes = nodes.filter((node) =>
        node.compatible_available_gpus?.some((gpu) => gpu.model === gpuModel),
      )

      // Flatten to create one entry per GPU device of matching model
      nodes = nodes.flatMap((node) => {
        const matchingGpus =
          node.compatible_available_gpus?.filter(
            (gpu) => gpu.model === gpuModel,
          ) || []

        return matchingGpus.map((gpu) => ({
          ...node,
          selectedGpu: gpu,
        }))
      })
    }

    // Sort by score (descending) - highest score first
    return nodes.sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [selectedSpecs, validNodes, gpuModel])

  // Auto-select the highest-scoring compatible node
  const autoSelectedNode = useMemo(() => {
    if (!enabled) return undefined
    if (compatibleNodes.length === 0) return undefined

    return compatibleNodes[0]
  }, [enabled, compatibleNodes])

  return {
    autoSelectedNode,
    compatibleNodes,
  }
}
