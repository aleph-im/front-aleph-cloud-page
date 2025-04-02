import { memo } from 'react'
import Head from 'next/head'
import { useComputeResourceNodeDetailPage } from './hook'
import { Button, Icon, Tabs } from '@aleph-front/core'
import NodeDetailHeader from '@/components/common/NodeDetailHeader'
import OverviewTabContent from './tabs/OverviewTabContent/cmp'
import PoliciesTabContent from './tabs/PoliciesTabContent'

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

  return (
    <>
      <Head>
        <title>Aleph Cloud | CRN Detail</title>
        <meta name="description" content="Aleph Cloud Compute Resource Node" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section>
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
      </section>
      {isOwner && (
        <section tw="my-8 flex items-center justify-end gap-7">
          <Button
            kind="flat"
            variant="textOnly"
            size="md"
            color="error"
            onClick={handleRemove}
          >
            <Icon name="trash" color="error" size="lg" />
            remove node
          </Button>
          <Button
            kind="gradient"
            variant="primary"
            size="md"
            color="main0"
            onClick={handleSubmit}
            disabled={!isDirty}
          >
            save changes
          </Button>
        </section>
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
    </>
  )
}
ComputeResourceNodeDetailPage.displayName = 'ComputeResourceNodeDetailPage'

export default memo(ComputeResourceNodeDetailPage)
