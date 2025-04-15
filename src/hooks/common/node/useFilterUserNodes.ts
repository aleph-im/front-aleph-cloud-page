import { useCallback, useMemo } from 'react'
import { AlephNode } from '@/domain/node'
import { useNodeManager } from '../useManager/useNodeManager'

export type UseFilterUserNodesProps<Node> = {
  nodes?: Node[]
}

export type UseFilterUserNodesReturn<Node> = {
  userNodes?: Node[]
}

export function useFilterUserNodes<Node extends AlephNode>({
  nodes,
}: UseFilterUserNodesProps<Node>): UseFilterUserNodesReturn<Node> {
  // Use the singleton nodeManager
  const nodeManager = useNodeManager()

  const filterUserNodes = useCallback(
    (nodes?: Node[]) => {
      if (!nodes) return
      return nodes.filter((node) => nodeManager.isUserNode(node))
    },
    [nodeManager],
  )

  const userNodes = useMemo(
    () => filterUserNodes(nodes),
    [filterUserNodes, nodes],
  )

  return { userNodes }
}
