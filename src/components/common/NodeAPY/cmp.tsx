import { memo } from 'react'
import { StyledAPYIcon } from './styles'
import { CCN } from '@/domain/node'
import { StakeManager } from '@/domain/stake'

// https://github.com/aleph-im/aleph-account/blob/main/src/components/NodesTable.vue#L586
export const NodeAPY = ({ node, nodes }: { node: CCN; nodes: CCN[] }) => {
  // @todo: Refactor this (use singleton)
  const rewardManager = new StakeManager()

  const nodeAPY = rewardManager.computeEstimatedStakersAPY(node, nodes)
  const currentAPY = rewardManager.currentAPY(nodes)
  const performance = nodeAPY / currentAPY

  return (
    <div tw="inline-flex gap-3 items-center">
      <StyledAPYIcon $performance={performance} />
      {Number(nodeAPY * 100).toFixed(2)}%
    </div>
  )
}
NodeAPY.displayName = 'NodeAPY'

export default memo(NodeAPY)
