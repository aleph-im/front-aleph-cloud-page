import { useMemo } from 'react'
import { AlephNode } from '@/domain/node'
import { useNodeManager } from '../useManager/useNodeManager'

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
  const nodeManager = useNodeManager()

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
