import { useMemo } from 'react'
import { AlephNode, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'

export type UseFilterNodeIssuesProps<T extends AlephNode> = {
  nodes?: T[]
  isStaking?: boolean
}

export type UseFilterNodeIssuesReturn = {
  nodesIssues: Record<string, string>
  warningFlag: number
}

export function useFilterNodeIssues<T extends AlephNode>({
  nodes,
  isStaking,
}: UseFilterNodeIssuesProps<T>): UseFilterNodeIssuesReturn {
  const [state] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const nodesIssues = useMemo(() => {
    const issues: Record<string, string> = {}
    if (!nodes?.length) return issues

    return nodes.reduce((ac, node) => {
      const issue = nodeManager.hasIssues(node, isStaking)
      if (!issue) return ac

      ac[node.hash] = issue
      return ac
    }, issues)
  }, [isStaking, nodeManager, nodes])

  const warningFlag = useMemo(
    () => Object.values(nodesIssues).length,
    [nodesIssues],
  )

  return { nodesIssues, warningFlag }
}