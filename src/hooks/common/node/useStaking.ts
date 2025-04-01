import { useAppState } from '@/contexts/appState'
import { CCN, NodeManager } from '@/domain/node'
import { StakeManager } from '@/domain/stake'
import { EntityAddAction } from '@/store/entity'
import { useNotification } from '@aleph-front/core'
import { useCallback, useMemo } from 'react'
import { useNodeManager } from '../useManager/useNodeManager'
import { useStakeManager } from '../useManager/useStakeManager'

export type UseStakingReturn = {
  userStake: number
  handleStake: (nodeHash: string) => Promise<boolean>
  handleUnstake: (nodeHash: string) => Promise<boolean>
}

function calculateVirtualNodesStake(
  nodes: CCN[] = [],
  stakeNode: CCN,
  address: string,
  balance: number,
  nodeManager: NodeManager,
): CCN[] {
  const userStakingNodes = [
    ...nodes.filter((node) => nodeManager.isUserStake(node)),
    stakeNode,
  ]
  const perNodeStake = balance / userStakingNodes.length
  const newStakers = userStakingNodes.map((node) => {
    return {
      ...node,
      stakers: { ...node.stakers, [address]: perNodeStake },
      virtual: Date.now(),
    }
  })

  return newStakers
}

function calculateVirtualNodesUnstake(
  nodes: CCN[] = [],
  unstakeNode: CCN,
  address: string,
  balance: number,
  nodeManager: NodeManager,
): CCN[] {
  const userStakingNodes = nodes.filter((node) => nodeManager.isUserStake(node))
  const perNodeStake = balance / (userStakingNodes.length - 1)
  const newStakers = userStakingNodes.map((node) => {
    let stakers

    if (node.hash === unstakeNode.hash) {
      const { [address]: _, ...rest } = node.stakers
      stakers = rest
    } else {
      stakers = { ...node.stakers, [address]: perNodeStake }
    }

    return {
      ...node,
      stakers,
      virtual: Date.now(),
    }
  })

  return newStakers
}

export function useStaking(): UseStakingReturn {
  const [state, dispatch] = useAppState()
  const { account, balance = 0 } = state.connection
  const { entities: nodes } = state.ccns

  const stakeManager = useStakeManager()
  const nodeManager = useNodeManager()
  
  const noti = useNotification()

  const userStake = useMemo(
    () => stakeManager.totalStakedByUser(nodes || []),
    [nodes, stakeManager],
  )

  const handleStake = useCallback(
    async (nodeHash: string) => {
      try {
        if (!noti) throw new Error('Notification not ready')
        if (!account) throw new Error('Invalid account')

        const targetNode = nodes?.find((node) => node.hash === nodeHash)
        if (!targetNode) throw new Error('Invalid staking node')

        if (!nodeManager.isStakeableBy(targetNode, balance))
          throw new Error('Not stakeable node')

        await stakeManager.stake(nodeHash)

        noti.add({
          variant: 'success',
          title: 'Success',
          text: `Staked in "${nodeHash}" successfully.`,
        })

        const entities = calculateVirtualNodesStake(
          nodes,
          targetNode,
          account.address,
          balance,
          nodeManager,
        )

        dispatch(
          new EntityAddAction<CCN>({
            name: 'ccns',
            entities,
          }),
        )

        return true
      } catch (e) {
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error).message,
        })
      }

      return false
    },
    [account, balance, dispatch, nodeManager, nodes, noti, stakeManager],
  )

  const handleUnstake = useCallback(
    async (nodeHash: string) => {
      try {
        if (!noti) throw new Error('Notification not ready')
        if (!account) throw new Error('Invalid account')

        const targetNode = nodes?.find((node) => node.hash === nodeHash)
        if (!targetNode) throw new Error('Invalid staking node')

        if (!nodeManager.isUserStake(targetNode))
          throw new Error('Not stakeable node')

        await stakeManager.unstake(nodeHash)

        noti.add({
          variant: 'success',
          title: 'Success',
          text: `Unstaked from "${nodeHash}" successfully.`,
        })

        const entities = calculateVirtualNodesUnstake(
          nodes,
          targetNode,
          account.address,
          balance,
          nodeManager,
        )

        dispatch(
          new EntityAddAction<CCN>({
            name: 'ccns',
            entities,
          }),
        )

        return true
      } catch (e) {
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error).message,
        })
      }

      return false
    },
    [account, balance, dispatch, nodeManager, nodes, noti, stakeManager],
  )

  return {
    userStake,
    handleStake,
    handleUnstake,
  }
}