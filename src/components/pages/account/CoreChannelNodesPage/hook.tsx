import { useMemo, useState } from 'react'
import {
  NotificationBadge,
  TabsProps,
  usePaginatedList,
} from '@aleph-front/core'
import { useAppState } from '@/contexts/appState'
import { CCN } from '@/domain/node'
import {
  UseCoreChannelNodesReturn,
  useCoreChannelNodes,
} from '@/hooks/common/node/useCoreChannelNodes'
import { useFilterNodeIssues } from '@/hooks/common/node/useFilterNodeIssues'
import { useFilterUserNodes } from '@/hooks/common/node/useFilterUserNodes'
import { useSortByIssuesNodes } from '@/hooks/common/node/useSortByIssuesNodes'

export type UseCoreChannelNodesPageProps = {
  nodes?: CCN[]
}

export type UseCoreChannelNodesPageReturn = UseCoreChannelNodesReturn & {
  userNodes?: CCN[]
  filteredUserNodes?: CCN[]
  userNodesIssues: Record<string, string>
  selectedTab: string
  tabs: TabsProps['tabs']
  paginatedSortedFilteredNodes?: CCN[]
  loadItemsDisabled: boolean
  handleLoadItems: () => Promise<void>
  handleTabChange: (tab: string) => void
}

export function useCoreChannelNodesPage(
  props: UseCoreChannelNodesPageProps,
): UseCoreChannelNodesPageReturn {
  const [state] = useAppState()
  const { account, balance: accountBalance = 0 } = state.connection

  const { nodes, filteredNodes, ...rest } = useCoreChannelNodes(props)

  // -----------------------------

  const { userNodes } = useFilterUserNodes({ nodes })
  const { userNodes: baseFilteredUserNodes } = useFilterUserNodes({
    nodes: filteredNodes,
  })

  // -----------------------------

  const { nodesIssues: userNodesIssues, warningFlag: userNodesWarningFlag } =
    useFilterNodeIssues({
      nodes: baseFilteredUserNodes,
    })

  // -----------------------------

  const { sortedNodes: filteredUserNodes } = useSortByIssuesNodes({
    nodesIssues: userNodesIssues,
    nodes: baseFilteredUserNodes,
  })

  // -----------------------------

  const [tab, handleTabChange] = useState<string>()
  const selectedTab = tab || (!!userNodes?.length ? 'user' : 'nodes')

  const tabs = useMemo(() => {
    const tabs: TabsProps['tabs'] = [
      { id: 'nodes', name: 'All core nodes' },
      {
        id: 'user',
        name: 'My core nodes',
        label: userNodesWarningFlag
          ? {
              label: (
                <NotificationBadge>{userNodesWarningFlag}</NotificationBadge>
              ),
              position: 'top',
            }
          : undefined,
      },
    ]

    return tabs
  }, [userNodesWarningFlag])

  // ----------------------------- PAGINATE

  const {
    list: paginatedSortedFilteredNodes,
    loadItemsDisabled,
    handleLoadItems,
  } = usePaginatedList({
    list: filteredNodes,
    itemsPerPage: 20,
    numberOfPages: 2,
  })

  return {
    ...rest,
    account,
    accountBalance,
    nodes,
    filteredNodes,
    userNodes,
    filteredUserNodes,
    selectedTab,
    tabs,
    userNodesIssues,
    paginatedSortedFilteredNodes,
    loadItemsDisabled,
    handleLoadItems,
    handleTabChange,
  }
}
