import { useCallback, useMemo } from 'react'
import { CCN } from '@/domain/node'
import { useNodeManager } from '../useManager/useNodeManager'

export type UseFilterUserStakeNodesProps = {
  nodes?: CCN[]
}

export type UseFilterUserStakeNodesReturn = {
  stakeNodes?: CCN[]
}

export function useFilterUserStakeNodes({
  nodes,
}: UseFilterUserStakeNodesProps): UseFilterUserStakeNodesReturn {
  const nodeManager = useNodeManager()

  const filterStakeNodes = useCallback(
    (nodes?: CCN[]) => {
      if (!nodes) return
      return nodes.filter((node) => nodeManager.isUserStake(node))
    },
    [nodeManager],
  )

  const stakeNodes = useMemo(
    () => filterStakeNodes(nodes),
    [filterStakeNodes, nodes],
  )

  return { stakeNodes }
}
