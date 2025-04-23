import { memo, useMemo } from 'react'
import Head from 'next/head'
import { useComputeResourceNodeDetailPage } from './hook'
import { Icon, Tabs } from '@aleph-front/core'
import { useAppState } from '@/contexts/appState'
import { BlockchainId, blockchains } from '@/domain/connect/base'
import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { unsupportedNetworkDisabledMessage } from '@/components/pages/account/disabledMessages'
import NodeDetailHeader from '@/components/common/NodeDetailHeader'
import OverviewTabContent from './tabs/OverviewTabContent/cmp'
import PoliciesTabContent from './tabs/PoliciesTabContent'
import { CenteredContainer } from '@/components/common/CenteredContainer'

export const ComputeResourceNodeDetailPage = () => {
  const {
    theme,
    node,
    nodesOnSameASN,
    baseLatency,
    lastMetricsCheck,
    calculatedRewards,
    creationDate,
    nameCtrl,
    descriptionCtrl,
    bannerCtrl,
    pictureCtrl,
    isOwner,
    isDirty,
    rewardCtrl,
    streamRewardCtrl,
    addressCtrl,
    termsAndConditionsCtrl,
    asnTier,
    nodeSpecs,
    nodeIssue,
    createInstanceUrl,
    isLinked,
    isLinkableByUser,
    isUnlinkableByUser,
    tabId,
    setTabId,
    tabs,
    handleRemovePolicies,
    handleRemove,
    handleSubmit,
    handleLink,
    handleUnlink,
  } = useComputeResourceNodeDetailPage()

  const [state] = useAppState()
  const { blockchain } = state.connection

  const isEthereumNetwork = useMemo(() => {
    return blockchain === BlockchainId.ETH
  }, [blockchain])

  const blockchainName = useMemo(() => {
    return blockchain ? blockchains[blockchain]?.name : 'Current network'
  }, [blockchain])

  return (
    <>
      <Head>
        <title>Account | CRN Detail - Aleph Cloud</title>
        <meta name="description" content="Aleph Cloud Compute Resource Node" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CenteredContainer $variant="xl">
        <section tw="pt-0">
          <NodeDetailHeader
            {...{
              node,
              nameCtrl,
              descriptionCtrl,
              bannerCtrl,
              pictureCtrl,
              isOwner,
            }}
          />
          {isOwner && (
            <div tw="my-8 flex items-center justify-end gap-7">
              <ButtonWithInfoTooltip
                kind="flat"
                variant="textOnly"
                size="md"
                color="error"
                onClick={handleRemove}
                disabled={!isEthereumNetwork}
                tooltipContent={
                  !isEthereumNetwork
                    ? unsupportedNetworkDisabledMessage(blockchainName)
                    : undefined
                }
                tooltipPosition={{
                  my: 'bottom-center',
                  at: 'top-center',
                }}
              >
                <Icon name="trash" color="error" size="lg" />
                remove node
              </ButtonWithInfoTooltip>
              <ButtonWithInfoTooltip
                kind="gradient"
                variant="primary"
                size="md"
                color="main0"
                onClick={handleSubmit}
                disabled={!isDirty || !isEthereumNetwork}
                tooltipContent={
                  !isEthereumNetwork
                    ? unsupportedNetworkDisabledMessage(blockchainName)
                    : undefined
                }
                tooltipPosition={{
                  my: 'bottom-center',
                  at: 'top-center',
                }}
              >
                save changes
              </ButtonWithInfoTooltip>
            </div>
          )}
          <div tw="flex my-8">
            <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
          </div>
          {tabId === 'overview' ? (
            <OverviewTabContent
              theme={theme}
              node={node}
              nodesOnSameASN={nodesOnSameASN}
              baseLatency={baseLatency}
              lastMetricsCheck={lastMetricsCheck}
              calculatedRewards={calculatedRewards}
              creationDate={creationDate}
              isOwner={isOwner}
              rewardCtrl={rewardCtrl}
              streamRewardCtrl={streamRewardCtrl}
              addressCtrl={addressCtrl}
              asnTier={asnTier}
              nodeSpecs={nodeSpecs}
              nodeIssue={nodeIssue}
              createInstanceUrl={createInstanceUrl}
              isLinked={isLinked}
              isLinkableByUser={isLinkableByUser}
              isUnlinkableByUser={isUnlinkableByUser}
              handleLink={handleLink}
              handleUnlink={handleUnlink}
            />
          ) : tabId === 'policies' ? (
            <PoliciesTabContent
              node={node}
              isOwner={isOwner}
              termsAndConditionsCtrl={termsAndConditionsCtrl}
              handleRemovePolicies={handleRemovePolicies}
            />
          ) : (
            ''
          )}
        </section>
      </CenteredContainer>
    </>
  )
}
ComputeResourceNodeDetailPage.displayName = 'ComputeResourceNodeDetailPage'

export default memo(ComputeResourceNodeDetailPage)
