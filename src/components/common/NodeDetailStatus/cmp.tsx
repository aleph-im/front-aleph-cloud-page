import { memo } from 'react'
import { AlephNode } from '@/domain/node'
import NodeStatus from '../NodeStatus'
import { StyledContainer } from './styles'

export type NodeDetailStatusProps = {
  status?: AlephNode['status']
}

export const NodeDetailStatus = ({
  status,
  ...rest
}: NodeDetailStatusProps) => {
  return (
    <StyledContainer {...rest}>
      <div className="tp-body fs-10">STATUS</div>
      <NodeStatus status={status || 'waiting'} />
    </StyledContainer>
  )
}
NodeDetailStatus.displayName = 'NodeDetailStatus'

export default memo(NodeDetailStatus)
