import { memo } from 'react'
import { AlephNode } from '@/domain/node'
import NodeStatus from '../NodeStatus'
import { StyledContainer } from './styles'

export type NodeDetailStatusProps = {
  status?: AlephNode['status']
  score?: number
}

export const NodeDetailStatus = ({
  status,
  score,
  ...rest
}: NodeDetailStatusProps) => {
  const scoreDisplay =
    score !== undefined ? `${(score * 100).toFixed(2)}%` : undefined

  return (
    <StyledContainer {...rest}>
      <div className="tp-body fs-10">STATUS</div>
      <div tw="flex items-end justify-between">
        <NodeStatus status={status || 'waiting'} />
        {scoreDisplay && <span className="tp-body3 fs-16">{scoreDisplay}</span>}
      </div>
    </StyledContainer>
  )
}
NodeDetailStatus.displayName = 'NodeDetailStatus'

export default memo(NodeDetailStatus)
