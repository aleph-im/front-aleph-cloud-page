import { memo, useMemo } from 'react'
import tw from 'twin.macro'
import {
  NodeName,
  NodeScore,
  NodeVersion,
  NotificationBadge,
  TableColumn,
} from '@aleph-front/core'
import { CCN, NodeLastVersions } from '@/domain/node'
import NodesTable from '@/components/common/NodesTable'
import NodeLinkedNodes from '@/components/common/NodeLinkedNodes'
import APYCell from '@/components/common/NodeAPY'
import NodeStaked from '@/components/common/NodeStaked'
import ButtonLink from '../ButtonLink'
import { apiServer } from '@/helpers/constants'
import Image from 'next/image'
import { UseSortedListReturn } from '@/hooks/common/useSortedList'

export type CoreChannelNodesTableProps = {
  nodes: CCN[]
  filteredNodes?: CCN[]
  lastVersion?: NodeLastVersions
  nodesIssues?: Record<string, string>
  loadItemsDisabled?: boolean
  handleLoadItems?: () => Promise<void>
  handleSortItems?: UseSortedListReturn<CCN>['handleSortItems']
}

export const CoreChannelNodesTable = ({
  nodes,
  filteredNodes,
  lastVersion,
  nodesIssues,
  loadItemsDisabled,
  handleLoadItems,
  handleSortItems,
}: CoreChannelNodesTableProps) => {
  const columns = useMemo(() => {
    return [
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
        label: 'SCORE',
        sortable: true,
        sortBy: (node) => node.score,
        render: (node) => <NodeScore score={node.score} />,
      },
      {
        label: 'LINKED',
        sortable: true,
        sortBy: (node) => node.resource_nodes.length,
        render: (node) => <NodeLinkedNodes nodes={node.crnsData} />,
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
        label: 'EST. APY',
        render: (node) => <APYCell node={node} nodes={nodes} />,
      },
      {
        label: 'VERSION',
        sortable: true,
        sortBy: (node) => node.metricsData?.version,
        render: (node) => (
          <NodeVersion
            version={node.metricsData?.version || ''}
            lastVersion={lastVersion}
          />
        ),
      },
      {
        label: '',
        align: 'right',
        render: (node) => (
          <div tw="inline-flex gap-3 justify-end">
            <ButtonLink
              kind="gradient"
              size="md"
              variant="secondary"
              color="main0"
              href={`/earn/ccn/${node.hash}`}
            >
              Info
            </ButtonLink>
          </div>
        ),
      },
    ] as TableColumn<CCN>[]
  }, [lastVersion, nodes, nodesIssues])

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
CoreChannelNodesTable.displayName = 'CoreChannelNodesTable'

export default memo(CoreChannelNodesTable)
