import { memo, useMemo } from 'react'
import tw from 'twin.macro'
import {
  NodeName,
  NodeScore,
  NodeVersion,
  NotificationBadge,
  TableColumn,
} from '@aleph-front/core'
import { Account } from '@aleph-sdk/account'
import { CCN, CRN, NodeLastVersions } from '@/domain/node'
import NodesTable from '@/components/common/NodesTable'
import NodeDecentralization from '../NodeDecentralization'
import CRNRewardsCell from '../CRNRewardsCell'
import LinkCRNButton from '../LinkCRNButton'
import ButtonLink from '../ButtonLink'
import Image from 'next/image'
import { apiServer } from '@/helpers/constants'
import { UseSortedListReturn } from '@/hooks/common/useSortedList'
import { UseLinkingReturn } from '@/hooks/common/node/useLinking'

export type ComputeResourceNodesTableProps = Pick<
  UseLinkingReturn,
  'handleLink' | 'handleUnlink'
> & {
  filteredNodes?: CRN[]
  userNode?: CCN
  account?: Account
  lastVersion?: NodeLastVersions
  nodesIssues?: Record<string, string>
  loadItemsDisabled?: boolean
  handleLoadItems?: () => Promise<void>
  handleSortItems?: UseSortedListReturn<CRN>['handleSortItems']
}

export const ComputeResourceNodesTable = ({
  filteredNodes,
  userNode,
  account,
  lastVersion,
  nodesIssues,
  loadItemsDisabled,
  handleLoadItems,
  handleSortItems,
  handleLink: onLink,
  handleUnlink: onUnlink,
}: ComputeResourceNodesTableProps) => {
  const columns = useMemo(() => {
    return [
      {
        label: '',
        align: 'center',
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
        sortBy: (node) => node.parentData?.name,
        render: (node) => (
          <>
            {node.parentData ? (
              <NodeName
                hash={node.parentData.hash}
                name={node.parentData.name}
                picture={node.parentData.picture}
                apiServer={apiServer}
                ImageCmp={Image}
              />
            ) : (
              '-'
            )}
          </>
        ),
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
        label: 'DECENTRALIZED',
        sortable: true,
        sortBy: (node) => node.decentralization,
        render: (node) => (
          <NodeDecentralization decentralization={node.decentralization} />
        ),
      },
      {
        label: 'EST. REWARDS',
        align: 'right',
        render: (node) => <CRNRewardsCell node={node} />,
      },
      {
        label: 'VERSION',
        sortable: true,
        align: 'right',
        width: '100%',
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
          <div tw="flex gap-3 justify-end">
            <LinkCRNButton
              {...{
                node,
                userNode,
                account,
                onLink,
                onUnlink,
              }}
            />
            <ButtonLink
              kind="gradient"
              size="md"
              variant="secondary"
              color="main0"
              href={`/account/earn/crn/${node.hash}`}
            >
              Info
            </ButtonLink>
          </div>
        ),
      },
    ] as TableColumn<CRN>[]
  }, [account, lastVersion, nodesIssues, onLink, onUnlink, userNode])

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
ComputeResourceNodesTable.displayName = 'ComputeResourceNodesTable'

export default memo(ComputeResourceNodesTable)
