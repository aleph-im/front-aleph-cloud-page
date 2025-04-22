import { memo } from 'react'
import Head from 'next/head'
import {
  Checkbox,
  Icon,
  Tabs,
  TextGradient,
  TextInput,
} from '@aleph-front/core'
import { UseStakingPageProps, useStakingPage } from './hook'
import RewardCalculator from '@/components/common/RewardCalculator'
import StakingNodesTable from '@/components/common/StakingNodesTable'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import StakeChart from '@/components/common/StakeChart'
import { useLazyRender } from '@/hooks/common/useLazyRender'
import { CenteredContainer } from '@/components/common/CenteredContainer'

export const StakingPage = (props: UseStakingPageProps) => {
  const {
    account,
    accountBalance,
    nodes,
    paginatedSortedFilteredNodes,
    stakeNodes,
    filteredStakeNodes,
    tabs,
    selectedTab,
    filter,
    isStakeableOnly,
    isStakeableOnlyDisabled,
    nodesIssues,
    loadItemsDisabled,
    handleLoadItems,
    handleSortItems,
    handleTabChange,
    handleFilterChange,
    handleStake,
    handleUnstake,
    handleStakeableOnlyChange: handleChangeStakeableOnly,
  } = useStakingPage(props)

  const { render } = useLazyRender()

  return (
    <>
      <Head>
        <title>Aleph Cloud | Account</title>
        <meta name="description" content="Aleph Cloud Account Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CenteredContainer $variant="xl">
        <section>
          <TextGradient type="h5" forwardedAs="h1" tw="mb-8">
            Staking
          </TextGradient>
          <ToggleDashboard>
            <div tw="flex items-start gap-6 flex-wrap 2xl:flex-nowrap">
              <div tw="flex-auto self-stretch">
                <h2 className="tp-h7" tw="mb-0">
                  What is staking with Aleph Cloud?
                </h2>
                <p className="fs-16">
                  What is staking with Aleph Cloud? Staking is the heartbeat of
                  our dynamic peer-to-peer network, driving security,
                  decentralization, and rewards. With a minimum of 10,000 Aleph
                  tokens, stakeholders form the network&apos;s foundation.
                  Rewards are distributed every 10 days and are auto-compounded,
                  allowing your stake to grow organically. The APY depends on
                  factors like linked Compute Resource Nodes (CRNs) and node
                  scoring, ensuring a fair and dynamic experience. Aleph Cloud
                  staking empowers you to control the controllers, shaping
                  decentralized connectivity while earning rewards. Plus,
                  it&apos;s non-custodial.{' '}
                  <strong className="text-main0" tw="font-bold">
                    Join us today!
                  </strong>
                </p>
              </div>
              <div tw="flex-auto 2xl:flex-none max-w-full flex items-stretch gap-6 flex-wrap 2xl:flex-nowrap">
                <div tw="flex-auto 2xl:flex-none max-w-full">
                  <RewardCalculator nodes={nodes} />
                </div>
                <div tw="flex-auto 2xl:flex-none items-stretch flex gap-6 flex-wrap sm:flex-nowrap">
                  <div tw="flex-1">
                    <StakeChart nodes={nodes} />
                  </div>
                </div>
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
                  label="Ready to stake"
                  checked={isStakeableOnly}
                  onChange={handleChangeStakeableOnly}
                  size="xs"
                  disabled={isStakeableOnlyDisabled}
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
                      {nodes && filteredStakeNodes ? (
                        <>
                          <StakingNodesTable
                            {...{
                              nodes,
                              filteredNodes: filteredStakeNodes,
                              accountBalance,
                              account,
                              handleStake,
                              handleUnstake,
                              showStakedAmount: true,
                              nodesIssues,
                            }}
                          />
                          <div tw="my-10 mx-4 text-center opacity-60">
                            {!account
                              ? 'Connect your wallet to see your stakes.'
                              : !stakeNodes?.length
                                ? 'You are not staking.'
                                : ''}
                          </div>
                        </>
                      ) : (
                        <>No data</>
                      )}
                    </>
                  ) : (
                    <>
                      {nodes && (
                        <StakingNodesTable
                          {...{
                            nodes,
                            filteredNodes: paginatedSortedFilteredNodes,
                            accountBalance,
                            account,
                            handleStake,
                            handleUnstake,
                            nodesIssues,
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
StakingPage.displayName = 'StakingPage'

export default memo(StakingPage)
