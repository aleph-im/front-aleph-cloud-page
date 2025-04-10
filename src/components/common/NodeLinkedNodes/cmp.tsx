import { HTMLAttributes, memo } from 'react'
import { StyledDotIcon } from './styles'
import { CRN, NodeManager } from '@/domain/node'

// https://github.com/aleph-im/aleph-account/blob/main/src/components/NodesTable.vue#L163

export type NodeLinkedNodesProps = HTMLAttributes<HTMLDivElement> & {
  nodes?: CRN[]
  subfix?: string
}

export const NodeLinkedNodes = ({
  nodes,
  subfix,
  ...rest
}: NodeLinkedNodesProps) => {
  const max = NodeManager.maxLinkedPerNode

  return (
    <div tw="inline-flex items-center gap-3" {...rest}>
      <div tw="flex items-stretch gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <StyledDotIcon key={i} $score={nodes?.[i]?.score} />
        ))}
      </div>
      <div tw="whitespace-nowrap leading-4" className="fs-10">
        {nodes?.length}{' '}
        <span tw="opacity-20">
          of {max}
          {subfix}
        </span>
      </div>
    </div>
  )
}
NodeLinkedNodes.displayName = 'NodeLinkedNodes'

export default memo(NodeLinkedNodes)
