import { memo, useMemo } from 'react'
import {
  NodeName,
  NodeScore,
  NotificationBadge,
  TableColumn,
} from '@aleph-front/core'
import { CCN } from '@/domain/node'
import NodesTable from '@/components/common/NodesTable'
import NodeLinkedNodes from '@/components/common/NodeLinkedNodes'
import APYCell from '@/components/common/NodeAPY'
import NodeStaked from '@/components/common/NodeStaked'
import StakeButton from '@/components/common/StakeButton'
import { Account } from '@aleph-sdk/account'
import NodeAmount from '@/components/common/NodeAmount'
import tw from 'twin.macro'
import ButtonLink from '../ButtonLink'
import { apiServer } from '@/helpers/constants'
import Image from 'next/image'
import { UseSortedListReturn } from '@/hooks/common/useSortedList'

export type StakingNodesTableProps = {
  nodes: CCN[]
  filteredNodes?: CCN[]
  account?: Account
  accountBalance?: number
  showStakedAmount?: boolean
  nodesIssues?: Record<string, string>
  loadItemsDisabled?: boolean
  handleLoadItems?: () => Promise<void>
  handleSortItems?: UseSortedListReturn<CCN>['handleSortItems']
  handleStake: (nodeHash: string) => void
  handleUnstake: (nodeHash: string) => void
}

export const StakingNodesTable = ({
  nodes,
  filteredNodes,
  account,
  accountBalance,
  showStakedAmount,
  nodesIssues,
  loadItemsDisabled,
  handleLoadItems,
  handleSortItems,
  handleStake: onStake,
  handleUnstake: onUnstake,
}: StakingNodesTableProps) => {
  const columns = useMemo(() => {
    const cols = [
      {
        label: '',
        align: 'center',
        width: 0,
        cellProps: () => ({ css: tw`p-0!` }),
        hcellProps: () => ({ css: tw`p-0! border-0!` }),
        render: (node) =>
          nodesIssues?.[node.hash] ? (
            <NotificationBadge tw="flex! mx-auto!">&nbsp;</NotificationBadge>
          ) : null,
      },
      {
        label: 'EST. APY',
        render: (node) => <APYCell node={node} nodes={nodes} />,
      },
      {
        label: 'NAME',
        sortable: true,
        sortBy: (node) => node.name,
        render: (node) => (
          <NodeName
            hash={node.hash}
            name={node.name}
            picture={node.picture}
            apiServer={apiServer}
            ImageCmp={Image}
          />
        ),
      },
      {
        label: 'STAKED',
        sortable: true,
        width: '100%',
        sortBy: (node) => node.total_staked,
        render: (node) => (
          <NodeStaked
            staked={node.total_staked}
            status={node.status}
            locked={node.locked}
          />
        ),
      },
      {
        label: 'LINKED',
        sortable: true,
        sortBy: (node) => node.resource_nodes.length,
        render: (node) => <NodeLinkedNodes nodes={node.crnsData} />,
      },
      {
        label: 'SCORE',
        sortable: true,
        sortBy: (node) => node.score,
        render: (node) => <NodeScore score={node.score} />,
      },
      {
        label: '',
        align: 'right',
        render: (node) => (
          <div tw="flex gap-3 justify-end">
            <StakeButton
              {...{
                node,
                accountBalance,
                onStake,
                onUnstake,
              }}
            />
            <ButtonLink
              kind="gradient"
              size="md"
              variant="secondary"
              color="main0"
              href={`/account/earn/ccn/${node.hash}`}
            >
              Info
            </ButtonLink>
          </div>
        ),
      },
    ] as TableColumn<CCN>[]

    if (showStakedAmount && account) {
      cols.splice(cols.length - 1, 0, {
        label: 'AMOUNT',
        sortable: true,
        sortBy: (node) => node.stakers[account.address] || 0,
        render: (node) => (
          <NodeAmount amount={node.stakers[account.address] || 0} />
        ),
      })
    }

    return cols
  }, [
    account,
    accountBalance,
    nodes,
    nodesIssues,
    onStake,
    onUnstake,
    showStakedAmount,
  ])

  return (
    <NodesTable
      {...{
        columns,
        data: filteredNodes,
        infiniteScroll: !loadItemsDisabled,
        onLoadMore: handleLoadItems,
        onSort: handleSortItems,
      }}
    />
  )
}
StakingNodesTable.displayName = 'StakingNodesTable'

export default memo(StakingNodesTable)
