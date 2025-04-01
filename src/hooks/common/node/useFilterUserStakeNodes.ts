import { useCallback, useMemo } from 'react'
import { CCN, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'

export type UseFilterUserStakeNodesProps = {
  nodes?: CCN[]
}

export type UseFilterUserStakeNodesReturn = {
  stakeNodes?: CCN[]
}

export function useFilterUserStakeNodes({
  nodes,
}: UseFilterUserStakeNodesProps): UseFilterUserStakeNodesReturn {
  const [state] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

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
