import { useCallback, useMemo } from 'react'
import { AlephNode, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'

export type UseFilterUserNodesProps<Node> = {
  nodes?: Node[]
}

export type UseFilterUserNodesReturn<Node> = {
  userNodes?: Node[]
}

export function useFilterUserNodes<Node extends AlephNode>({
  nodes,
}: UseFilterUserNodesProps<Node>): UseFilterUserNodesReturn<Node> {
  const [state] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

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
