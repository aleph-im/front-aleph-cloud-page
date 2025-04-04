import { useAppState } from '@/contexts/appState'
import { CCN, NodeManager } from '@/domain/node'
import {
  UseCoreChannelNodesReturn,
  useCoreChannelNodes,
} from '@/hooks/common/node/useCoreChannelNodes'
import { useFilterNodeIssues } from '@/hooks/common/node/useFilterNodeIssues'
import { useSortByIssuesNodes } from '@/hooks/common/node/useSortByIssuesNodes'
import { useFilterUserStakeNodes } from '@/hooks/common/node/useFilterUserStakeNodes'
import {
  NotificationBadge,
  TabsProps,
  usePaginatedList,
} from '@aleph-front/core'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useStaking } from '@/hooks/common/node/useStaking'
import { useSortedList } from '@/hooks/common/useSortedList'

export type UseStakingPageProps = {
  nodes?: CCN[]
}

export type UseStakingPageReturn = UseCoreChannelNodesReturn & {
  stakeNodes?: CCN[]
  filteredStakeNodes?: CCN[]
  selectedTab: string
  tabs: TabsProps['tabs']
  isStakeableOnly: boolean
  isStakeableOnlyDisabled: boolean
  nodesIssues: Record<string, string>
  paginatedSortedFilteredNodes?: CCN[]
  loadItemsDisabled: boolean
  handleLoadItems: () => Promise<void>
  handleTabChange: (tab: string) => void
  handleStake: (nodeHash: string) => void
  handleUnstake: (nodeHash: string) => void
  handleStakeableOnlyChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useStakingPage(
  props: UseStakingPageProps,
): UseStakingPageReturn {
  const [state] = useAppState()
  const {
    connection: { account, balance: accountBalance = 0 },
    manager: { nodeManager },
  } = state

  const {
    nodes,
    filteredNodes: baseFilteredNodes,
    ...rest
  } = useCoreChannelNodes({ ...props, filterKey: 'ccnsq' })

  // -----------------------------

  const [stakeableOnly, setStakeableOnly] = useState<boolean>()

  const handleChangeStakeableOnly = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const show = e.target.checked
      setStakeableOnly(show)
    },
    [],
  )

  // -----------------------------

  const { stakeNodes } = useFilterUserStakeNodes({ nodes })
  const { stakeNodes: baseFilteredStakeNodes } = useFilterUserStakeNodes({
    nodes: baseFilteredNodes,
  })

  // -----------------------------

  const { nodesIssues, warningFlag } = useFilterNodeIssues({
    nodes: baseFilteredStakeNodes,
    isStaking: true,
  })

  // -----------------------------

  const [tab, handleTabChange] = useState<string>()
  const selectedTab = tab || (stakeNodes?.length ? 'user' : 'nodes')

  const tabs = useMemo(() => {
    const tabs: TabsProps['tabs'] = [
      { id: 'nodes', name: 'All core nodes' },
      {
        id: 'user',
        name: 'My stakes',
        label: warningFlag
          ? {
              label: <NotificationBadge>{warningFlag}</NotificationBadge>,
              position: 'top',
            }
          : undefined,
      },
    ]

    return tabs
  }, [warningFlag])

  // -----------------------------

  const stakeableNodes = useMemo(() => {
    if (!baseFilteredNodes) return
    return baseFilteredNodes.filter(
      (node) => nodeManager.isStakeableBy(node, accountBalance)[0],
    )
  }, [accountBalance, baseFilteredNodes, nodeManager])

  const isStakeableOnlyDisabled =
    !stakeableNodes?.length || selectedTab !== 'nodes'
  const isStakeableOnly = isStakeableOnlyDisabled
    ? false
    : stakeableOnly !== undefined
      ? stakeableOnly
      : !!account

  const filteredNodes = useMemo(() => {
    if (!isStakeableOnly) return baseFilteredNodes
    if (!account) return baseFilteredNodes
    return stakeableNodes
  }, [isStakeableOnly, baseFilteredNodes, account, stakeableNodes])

  const { sortedNodes: filteredStakeNodes } = useSortByIssuesNodes({
    nodesIssues,
    nodes: baseFilteredStakeNodes,
  })

  // -----------------------------

  const { handleStake: handleStakeBase, handleUnstake: handleUnstakeBase } =
    useStaking()

  const handleStake = useCallback(
    async (nodeHash: string) => {
      const success = await handleStakeBase(nodeHash)
      if (!success) return

      handleTabChange('user')
    },
    [handleStakeBase],
  )

  const handleUnstake = useCallback(
    async (nodeHash: string) => {
      const success = await handleUnstakeBase(nodeHash)
      if (!success) return

      if (!stakeNodes || stakeNodes.length <= 1) {
        handleTabChange('nodes')
      }
    },
    [handleUnstakeBase, stakeNodes],
  )

  // -----------------------------

  const presortedFilteredNodes = useMemo(() => {
    if (!filteredNodes) return

    return filteredNodes.sort((a, b) => {
      const aSlotsScore =
        1 - Math.min(a.total_staked / NodeManager.maxStakedPerNode, 1)

      const bSlotsScore =
        1 - Math.min(b.total_staked / NodeManager.maxStakedPerNode, 1)

      const aScore =
        a.score + a.total_staked >= NodeManager.maxStakedPerNode
          ? 0
          : (a.score + aSlotsScore) / 2

      const bScore =
        b.score + b.total_staked >= NodeManager.maxStakedPerNode
          ? 0
          : (b.score + bSlotsScore) / 2

      return bScore - aScore
    })
  }, [filteredNodes])

  const { list: sortedFilteredNodes, handleSortItems } = useSortedList({
    list: presortedFilteredNodes,
  })

  const {
    list: paginatedSortedFilteredNodes,
    loadItemsDisabled,
    handleLoadItems,
  } = usePaginatedList({
    list: sortedFilteredNodes,
  })

  return {
    ...rest,
    account,
    accountBalance,
    nodes,
    filteredNodes,
    stakeNodes,
    filteredStakeNodes,
    selectedTab,
    tabs,
    isStakeableOnly,
    isStakeableOnlyDisabled,
    nodesIssues,
    paginatedSortedFilteredNodes,
    loadItemsDisabled,
    handleSortItems,
    handleLoadItems,
    handleTabChange,
    handleStake,
    handleUnstake,
    handleStakeableOnlyChange: handleChangeStakeableOnly,
  }
}
