import { memo, useCallback, useMemo } from 'react'
import { Button } from '@aleph-front/core'
import { CCN } from '@/domain/node'
import { useAppState } from '@/contexts/appState'

export type StakeButtonProps = {
  node: CCN
  accountBalance?: number
  onStake: (nodeHash: string) => void
  onUnstake: (nodeHash: string) => void
}

// https://github.com/aleph-im/aleph-account/blob/main/src/components/NodesTable.vue#L137
export const StakeButton = ({
  node,
  accountBalance = 0,
  onStake,
  onUnstake: onUnstake,
}: StakeButtonProps) => {
  const [state] = useAppState()
  const {
    manager: { nodeManager },
  } = state

  const isStakeNode = useMemo(() => {
    return nodeManager.isUserStake(node)
  }, [node, nodeManager])

  const isDisabled = useMemo(() => {
    const [canStake] = nodeManager.isStakeableBy(node, accountBalance)
    return !canStake
  }, [nodeManager, node, accountBalance])

  const handleOnClick = useCallback(() => {
    if (isStakeNode) {
      onUnstake(node.hash)
    } else {
      onStake(node.hash)
    }
  }, [isStakeNode, onUnstake, node.hash, onStake])

  return (
    <>
      {!isStakeNode ? (
        <Button
          kind="gradient"
          size="md"
          variant="secondary"
          color="main0"
          onClick={handleOnClick}
          disabled={isDisabled}
        >
          Stake
        </Button>
      ) : (
        <Button
          kind="gradient"
          size="md"
          variant="secondary"
          color="main1"
          onClick={handleOnClick}
        >
          Unstake
        </Button>
      )}
    </>
  )
}
StakeButton.displayName = 'StakeButton'

export default memo(StakeButton)
