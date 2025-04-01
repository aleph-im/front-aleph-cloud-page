import { useCallback, useMemo } from 'react'
import { CRN, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
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
  const [state] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

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
