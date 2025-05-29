import { memo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Button,
  Checkbox,
  Icon,
  Tabs,
  TextGradient,
  TextInput,
} from '@aleph-front/core'
import ComputeResourceNodesTable from '@/components/common/ComputeResourceNodesTable'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import NetworkHealthChart from '@/components/common/NetworkHealthChart'
import HostingProviderChart from '@/components/common/HostingProviderChart'
import { useLazyRender } from '@/hooks/common/useLazyRender'
import TotalNetworkResourcesChart from '@/components/common/TotalNetworkResourcesChart'
import {
  useComputeResourceNodesPage,
  UseComputeResourceNodesPageProps,
} from './hook'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { NAVIGATION_URLS } from '@/helpers/constants'

export const ComputeResourceNodesPage = (
  props: UseComputeResourceNodesPageProps,
) => {
  const {
    account,
    nodes,
    paginatedSortedFilteredNodes,
    userNodes,
    filteredUserNodes,
    userNodesIssues,
    userNode,
    tabs,
    selectedTab,
    filter,
    lastVersion,
    isLinkableOnly,
    isLinkableOnlyDisabled,
    totalResources,
    loadItemsDisabled,
    showInactive,
    handleShowInactiveChange,
    handleLoadItems,
    handleSortItems,
    handleLink,
    handleUnlink,
    handleTabChange,
    handleFilterChange,
    handleLinkableOnlyChange,
  } = useComputeResourceNodesPage(props)

  const { render } = useLazyRender()

  const CreateNode = (
    <Link href={NAVIGATION_URLS.account.earn.crn.new} passHref legacyBehavior>
      <Button
        color="main0"
        kind="gradient"
        variant="secondary"
        size="md"
        tw="gap-2.5"
        disabled={!account}
      >
        <Icon name="key" />
        Create compute node
      </Button>
    </Link>
  )

  return (
    <>
      <Head>
        <title>Account - Aleph Cloud</title>
        <meta name="description" content="Aleph Cloud Account Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CenteredContainer $variant="xl">
        <section>
          <TextGradient type="h5" forwardedAs="h1" tw="mb-8">
            Compute nodes
          </TextGradient>
          <ToggleDashboard buttons={CreateNode}>
            <div tw="flex items-start gap-6 flex-wrap 2xl:flex-nowrap">
              <div tw="flex-auto 2xl:flex-none max-w-full flex items-stretch gap-6 flex-wrap 2xl:flex-nowrap order-2 2xl:order-none">
                <div tw="flex-auto 2xl:flex-none max-w-full">
                  <NetworkHealthChart
                    nodes={nodes}
                    title="CRN NETWORK HEALTH"
                  />
                </div>
                <div tw="flex-auto 2xl:flex-none items-stretch flex gap-6 flex-wrap sm:flex-nowrap">
                  <div tw="flex-1">
                    <HostingProviderChart
                      nodes={nodes}
                      title="TOP HOSTING PROVIDER"
                    />
                  </div>
                  <div tw="flex-1">
                    <TotalNetworkResourcesChart
                      title="TOTAL NETWORK RESOURCES"
                      resources={totalResources}
                    />
                  </div>
                </div>
              </div>
              <div tw="flex-auto self-stretch flex flex-col justify-between">
                <div>
                  <h1 className="tp-h7" tw="mb-0">
                    What is a compute node?
                  </h1>
                  <p className="fs-16">
                    Anyone can set up a Compute Resource Node (CRN) to
                    contribute to our decentralized network. These nodes play a
                    crucial role in our ecosystem, enabling various services.
                    While no commitment is needed to establish a CRN, to unlock
                    a minimum wage for your CRN, it needs the endorsement of a
                    Core Channel Node (CCN). A CCN operator can vouch for up to
                    five CRNs, ensuring fair and balanced participation.
                  </p>
                  <ExternalLinkButton href="https://docs.aleph.im/nodes/compute/">
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
                  label="Ready to link"
                  checked={isLinkableOnly}
                  onChange={handleLinkableOnlyChange}
                  size="xs"
                  disabled={isLinkableOnlyDisabled}
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
                          <ComputeResourceNodesTable
                            {...{
                              nodes,
                              filteredNodes: filteredUserNodes,
                              nodesIssues: userNodesIssues,
                              userNode,
                              account,
                              lastVersion,
                              handleLink,
                              handleUnlink,
                            }}
                          />
                          <div tw="my-10 mx-4 text-center opacity-60">
                            {!account
                              ? 'Connect your wallet to see your compute node running.'
                              : !userNodes?.length
                                ? 'You have no compute node running.'
                                : ''}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {nodes && (
                        <ComputeResourceNodesTable
                          {...{
                            nodes,
                            filteredNodes: paginatedSortedFilteredNodes,
                            loadItemsDisabled,
                            handleLoadItems,
                            handleSortItems,
                            userNode,
                            account,
                            lastVersion,
                            handleLink,
                            handleUnlink,
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
ComputeResourceNodesPage.displayName = 'ComputeResourceNodesPage'

export default memo(ComputeResourceNodesPage)
