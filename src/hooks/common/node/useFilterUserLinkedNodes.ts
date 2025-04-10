import { useCallback, useMemo } from 'react'
import { CRN } from '@/domain/node'
import { useNodeManager } from '../useManager/useNodeManager'
import { useUserCoreChannelNode } from './useUserCoreChannelNode'

export type UseFilterUserLinkedNodesProps = {
  nodes?: CRN[]
}

export type UseFilterUserLinkedNodesReturn = {
  userLinkedNodes?: CRN[]
}

export function useFilterUserLinkedNodes({
  nodes,
}: UseFilterUserLinkedNodesProps): UseFilterUserLinkedNodesReturn {
  const nodeManager = useNodeManager()

  const { userNode } = useUserCoreChannelNode()

  const filterUserNodes = useCallback(
    (nodes?: CRN[]) => {
      if (!nodes) return
      return nodes.filter((node) => nodeManager.isUnlinkableBy(node, userNode))
    },
    [nodeManager, userNode],
  )

  const userLinkedNodes = useMemo(
    () => filterUserNodes(nodes),
    [filterUserNodes, nodes],
  )

  return { userLinkedNodes }
}
