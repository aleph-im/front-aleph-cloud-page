import { memo, useState } from 'react'
import Head from 'next/head'
import {
  Button,
  Checkbox,
  Icon,
  Tabs,
  TextGradient,
  TextInput,
} from '@aleph-front/core'
import { UseCoreChannelNodesPageProps, useCoreChannelNodesPage } from './hook'
import CoreChannelNodesTable from '@/components/common/CoreChannelNodesTable'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import Link from 'next/link'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import NetworkHealthChart from '@/components/common/NetworkHealthChart'
import EstimatedNodeRewardsChart from '@/components/common/EstimatedNodeRewardsChart'
import { useLazyRender } from '@/hooks/common/useLazyRender'
import AvailableCRNSpotChart from '@/components/common/AvailableCRNSpotChart'
import { StakeManager } from '@/domain/stake'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { NAVIGATION_URLS } from '@/helpers/constants'

export const CoreChannelNodesPage = (props: UseCoreChannelNodesPageProps) => {
  const {
    account,
    accountBalance,
    nodes,
    userNodes,
    filteredUserNodes,
    paginatedSortedFilteredNodes,
    userNodesIssues,
    tabs,
    selectedTab,
    filter,
    lastVersion,
    loadItemsDisabled,
    showInactive,
    handleLoadItems,
    handleSortItems,
    handleTabChange,
    handleFilterChange,
    handleShowInactiveChange,
  } = useCoreChannelNodesPage(props)

  const { render } = useLazyRender()

  const CreateNode = (
    <Link href={NAVIGATION_URLS.account.earn.ccn.new} passHref legacyBehavior>
      <Button
        color="main0"
        kind="gradient"
        variant="secondary"
        size="md"
        tw="gap-2.5"
        disabled={
          !account ||
          (accountBalance || 0) <= StakeManager.minStakeToActivateNode
        }
      >
        <Icon name="key" />
        Create core node
      </Button>
    </Link>
  )
  const [dashboardOpen, setDashboardOpen] = useState(true)

  return (
    <>
      <Head>
        <title>Account | Aleph Cloud</title>
        <meta name="description" content="Aleph Cloud Account Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CenteredContainer $variant="xl">
        <section>
          <TextGradient type="h5" forwardedAs="h1" tw="mb-8">
            Core nodes
          </TextGradient>
          <ToggleDashboard
            open={dashboardOpen}
            setOpen={setDashboardOpen}
            buttons={CreateNode}
          >
            <div tw="flex items-start gap-6 flex-wrap 2xl:flex-nowrap">
              <div tw="flex-auto 2xl:flex-none max-w-full flex items-stretch gap-6 flex-wrap 2xl:flex-nowrap order-2 2xl:order-none">
                <div tw="flex-auto 2xl:flex-none max-w-full">
                  <NetworkHealthChart
                    nodes={nodes}
                    title="CCN NETWORK HEALTH"
                  />
                </div>
                <div tw="flex-auto 2xl:flex-none items-stretch flex gap-6 flex-wrap sm:flex-nowrap">
                  <div tw="flex-1">
                    <EstimatedNodeRewardsChart nodes={nodes} />
                  </div>
                  <div tw="flex-1">
                    <AvailableCRNSpotChart
                      title="AVAILABLE CRN SPOTS"
                      nodes={nodes}
                    />
                  </div>
                </div>
              </div>
              <div tw="flex-auto self-stretch flex flex-col justify-between order-1 2xl:order-none">
                <div>
                  <h1 className="tp-h7" tw="mb-0">
                    What is a core node?
                  </h1>
                  <p className="fs-16">
                    CCNs are the cornerstone of Aleph Cloud, responsible for the
                    security and functionality of our peer-to-peer network.
                    These dedicated nodes, backed by a commitment of 200,000
                    Aleph tokens, play a pivotal role in network control and
                    governance. As non-custodial operators, they are at the
                    forefront of Aleph Cloud&apos;s innovative ecosystem. For
                    more information on how to set up a node and detailed
                    technical and token requirements, please visit our
                  </p>
                  <ExternalLinkButton href="https://docs.aleph.cloud/nodes/core/installation/">
                    Node Setup Guide
                  </ExternalLinkButton>
                </div>
                <div tw="mt-6 mb-4 2xl:mb-0">{CreateNode}</div>
              </div>
            </div>
          </ToggleDashboard>
          <div tw="mt-14">
            <div tw="flex mb-8 gap-10 justify-between flex-wrap flex-col md:flex-row items-stretch md:items-end">
              <div tw="flex flex-wrap flex-col sm:flex-row items-start sm:items-center gap-10 sm:gap-4">
                <Tabs
                  tabs={tabs}
                  align="left"
                  selected={selectedTab}
                  onTabChange={handleTabChange}
                />
                <Checkbox
                  label="Show inactive nodes"
                  checked={showInactive}
                  onChange={handleShowInactiveChange}
                  size="xs"
                />
              </div>
              <TextInput
                value={filter}
                name="filter-ccn"
                placeholder="Search me"
                onChange={handleFilterChange}
                icon={<Icon name="search" />}
              />
            </div>
            <div tw="relative">
              <SpinnerOverlay show={!render || !nodes} />
              {render && (
                <>
                  {selectedTab === 'user' ? (
                    <>
                      {nodes && filteredUserNodes && (
                        <>
                          <CoreChannelNodesTable
                            {...{
                              nodes,
                              filteredNodes: filteredUserNodes,
                              nodesIssues: userNodesIssues,
                              lastVersion,
                            }}
                          />
                          <div tw="my-10 mx-4 text-center opacity-60">
                            {!account
                              ? 'Connect your wallet to see your core node running.'
                              : !userNodes?.length
                                ? 'You have no core node running.'
                                : ''}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {nodes && (
                        <CoreChannelNodesTable
                          {...{
                            nodes,
                            filteredNodes: paginatedSortedFilteredNodes,
                            lastVersion,
                            loadItemsDisabled,
                            handleLoadItems,
                            handleSortItems,
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </CenteredContainer>
    </>
  )
}
CoreChannelNodesPage.displayName = 'CoreChannelNodesPage'

export default memo(CoreChannelNodesPage)
