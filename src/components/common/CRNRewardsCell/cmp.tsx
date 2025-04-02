import { memo, useMemo } from 'react'
import { CRN } from '@/domain/node'
import { StakeManager } from '@/domain/stake'
import { Price } from '../Price/cmp'

// https://github.com/aleph-im/aleph-account/blob/main/src/components/NodesTable.vue#L239
export const CRNRewardsCell = ({ node }: { node: CRN }) => {
  // @todo: Refactor this (use singleton)

  const rewards = useMemo(() => {
    const rewardManager = new StakeManager()
    return rewardManager.CRNRewardsPerDay(node) * (365 / 12)
  }, [node])

  const isNotFullyLinked = useMemo(() => !node.parent, [node])

  return (
    <>
      {isNotFullyLinked ? (
        <>-</>
      ) : (
        <div tw="inline-flex gap-2 items-center whitespace-nowrap">
          ~ <Price value={rewards} />
          /M
        </div>
      )}
    </>
  )
}
CRNRewardsCell.displayName = 'CRNRewardsCell'

export default memo(CRNRewardsCell)
