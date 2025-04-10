import { memo } from 'react'
import { Icon } from '@aleph-front/core'
import StyledProgressBar from '../ColorProgressBar'

// https://github.com/aleph-im/aleph-account/blob/main/src/components/NodesTable.vue#L137
export const NodeStaked = ({
  staked,
  status,
  locked,
}: {
  staked: number
  status: string

  locked?: boolean
}) => {
  const minStaked = 500_000
  const percent = Math.min(staked, minStaked) / minStaked
  const amount = Number(staked / 1_000).toFixed(0)
  const color = percent >= 1 ? 'success' : 'main0'

  return (
    <div className="fs-10" tw="leading-4 w-full">
      <div tw="flex items-center justify-between gap-1.5 whitespace-nowrap leading-4 mb-2.5">
        <div>
          {amount}k <span tw="opacity-20">of 500k</span>
        </div>
        <div tw="flex items-center gap-1 text-[0.375rem]">
          {status.toUpperCase()}
          {locked && <Icon name="lock" size="xs" />}
        </div>
      </div>
      <div tw="flex items-center gap-1">
        <StyledProgressBar $percent={percent} $color={color} />
      </div>
    </div>
  )
}
NodeStaked.displayName = 'NodeStaked'

export default memo(NodeStaked)
