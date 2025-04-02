import { memo } from 'react'
import { StyledDotIcon } from './styles'

// https://github.com/aleph-im/aleph-account/blob/8b920e34fab9f4f70e3387eed2bd5839ae923971/src/components/NodesTable.vue#L192
export const NodeDecentralization = ({
  decentralization,
}: {
  decentralization: number
}) => {
  const step = (i: number) => (i + 1) * 0.3

  return (
    <div tw="inline-flex items-center gap-3">
      <div tw="flex items-stretch gap-0.5">
        {Array.from({ length: 3 }, (_, i) => (
          <StyledDotIcon key={i} $active={decentralization >= step(i)} />
        ))}
      </div>
    </div>
  )
}
NodeDecentralization.displayName = 'NodeDecentralization'

export default memo(NodeDecentralization)
