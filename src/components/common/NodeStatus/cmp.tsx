import { memo } from 'react'
import { AlephNode } from '@/domain/node'
import { StyledStatusIcon } from './styles'

export type NodeStatusProps = {
  status: AlephNode['status']
}

export const NodeStatus = ({ status, ...rest }: NodeStatusProps) => {
  return (
    <div tw="flex items-center pt-1.5 gap-1.5" {...rest}>
      <StyledStatusIcon $status={status} />
      <span tw="capitalize" className="tp-body3">
        {status}
      </span>
    </div>
  )
}
NodeStatus.displayName = 'NodeStatus'

export default memo(NodeStatus)
