import { memo, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useCoreChannelNodeDetailPage } from './hook'
import { Icon, NodeName } from '@aleph-front/core'
import {
  ellipseAddress,
  getETHExplorerURL,
  getMultiaddressUrl,
} from '@/helpers/utils'
import { useAppState } from '@/contexts/appState'
import { BlockchainId, blockchains } from '@/domain/connect'
import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { unsupportedNetworkDisabledMessage } from '@/components/pages/account/disabledMessages'
import NodeDetailHeader from '@/components/common/NodeDetailHeader'
import Card2, { Card2Field } from '@/components/common/Card2'
import StyledProgressBar from '@/components/common/ColorProgressBar'
import NodeLinkedNodes, {
  LinkedStatusDotIcon,
} from '@/components/common/NodeLinkedNodes'
import ButtonLink from '@/components/common/ButtonLink'
import NodeDetailLockSwitch from '@/components/common/NodeDetailLockSwitch'
import NodeDetailStatus from '@/components/common/NodeDetailStatus'
import NodeDetailEditableField from '@/components/common/NodeDetailEditableField'
import NodeDetailLink from '@/components/common/NodeDetailLink'
import { apiServer } from '@/helpers/constants'
import Image from 'next/image'
import Price from '@/components/common/Price'
import { NodeManager } from '@/domain/node'
import { CenteredContainer } from '@/components/common/CenteredContainer'

export const CoreChannelNodeDetailPage = () => {
  const {
    node,
    baseLatency,
    aggregateLatency,
    fileDownloadLatency,
    metricsLatency,
    relativeETHHeightPercent,
    lastMetricsCheck,
    calculatedRewards,
    creationDate,
    isOwner,
    nameCtrl,
    descriptionCtrl,
    multiaddressCtrl,
    pictureCtrl,
    bannerCtrl,
    rewardCtrl,
    managerCtrl,
    lockedCtrl,
    registrationUrlCtrl,
    isDirty,
    isUnlinkableByUser,
    handleUnlink,
    handleRemove,
    handleSubmit,
  } = useCoreChannelNodeDetailPage()

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
        <title>Account | CCN Detail | Aleph Cloud</title>
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
          <div tw="mt-8">
            <div tw="flex flex-wrap gap-9">
              <div tw="flex-1 w-1/3 min-w-[20rem] flex flex-col gap-9">
                <Card2 title="GENERAL INFO">
                  <NodeDetailStatus status={node?.status} />
                  <Card2Field name="NAME" value={node?.name} />
                  <Card2Field name="ASN" value={node?.metricsData?.as_name} />
                  <Card2Field
                    name="OWNER"
                    value={
                      <NodeDetailLink
                        href={getETHExplorerURL({ address: node?.owner })}
                        isOwner={false}
                        textToCopy={node?.owner}
                      >
                        {node?.owner && ellipseAddress(node?.owner)}
                      </NodeDetailLink>
                    }
                    big
                  />
                  <Card2Field
                    name="REWARD ADDRESS"
                    value={
                      <NodeDetailEditableField
                        {...rewardCtrl.field}
                        {...rewardCtrl.fieldState}
                        placeholder="address"
                        isOwner={isOwner}
                      >
                        <NodeDetailLink
                          href={getETHExplorerURL({
                            tokenAddress: rewardCtrl.field.value,
                          })}
                          isOwner={isOwner}
                          textToCopy={rewardCtrl.field.value}
                        >
                          {rewardCtrl.field.value &&
                            ellipseAddress(rewardCtrl.field.value)}
                        </NodeDetailLink>
                      </NodeDetailEditableField>
                    }
                    big
                  />
                  <Card2Field
                    name="MULTI ADDRESS"
                    value={
                      <NodeDetailEditableField
                        {...multiaddressCtrl.field}
                        {...multiaddressCtrl.fieldState}
                        placeholder="multi address"
                        isOwner={isOwner}
                      >
                        <NodeDetailLink
                          href={getMultiaddressUrl({
                            multiaddress: multiaddressCtrl.field.value,
                          })}
                          isOwner={isOwner}
                          textToCopy={multiaddressCtrl.field.value}
                        >
                          {multiaddressCtrl.field.value &&
                            ellipseAddress(multiaddressCtrl.field.value)}
                        </NodeDetailLink>
                      </NodeDetailEditableField>
                    }
                    big
                  />
                </Card2>
                <Card2 title="ADDITIONAL SETTINGS">
                  <Card2Field
                    name="MANAGER"
                    value={
                      <NodeDetailEditableField
                        {...managerCtrl.field}
                        {...managerCtrl.fieldState}
                        placeholder="manager address"
                        isOwner={isOwner}
                      >
                        <NodeDetailLink
                          href={getETHExplorerURL({
                            address: managerCtrl.field.value,
                          })}
                          isOwner={isOwner}
                          textToCopy={managerCtrl.field.value}
                        >
                          {managerCtrl.field.value &&
                            ellipseAddress(managerCtrl.field.value)}
                        </NodeDetailLink>
                      </NodeDetailEditableField>
                    }
                    big
                  />
                  <Card2Field
                    name="REGISTRATION URL"
                    value={
                      <NodeDetailEditableField
                        {...registrationUrlCtrl.field}
                        {...registrationUrlCtrl.fieldState}
                        placeholder="registration url"
                        isOwner={isOwner}
                      >
                        <NodeDetailLink
                          href={registrationUrlCtrl.field.value}
                          isOwner={isOwner}
                          textToCopy={registrationUrlCtrl.field.value}
                        >
                          {registrationUrlCtrl.field.value}
                        </NodeDetailLink>
                      </NodeDetailEditableField>
                    }
                    big
                  />
                  <Card2Field
                    name={lockedCtrl.field.value ? 'LOCKED' : 'UNLOCKED'}
                    value={
                      <NodeDetailLockSwitch
                        {...(lockedCtrl.field as any)}
                        {...lockedCtrl.fieldState}
                        checked={lockedCtrl.field.value}
                        disabled={!isOwner}
                      />
                    }
                  />
                </Card2>
              </div>
              <div tw="flex-1 w-1/3 min-w-[20rem] flex flex-col gap-9">
                <Card2 title="REWARD INDICATORS">
                  <Card2Field name="LAST CHECK" value={lastMetricsCheck} />
                  {/* <Card2Field name="NODES ON ASN" value={nodesOnSameASN} /> */}
                  <Card2Field
                    name="VERSION"
                    value={node?.metricsData?.version}
                  />
                  <Card2Field name="BASE LATENCY" value={baseLatency} />
                  <Card2Field
                    name="AGGREGATE LATENCY"
                    value={aggregateLatency}
                  />
                  <Card2Field
                    name="FILE DOWNLOAD LATENCY"
                    value={fileDownloadLatency}
                  />
                  <Card2Field name="METRICS LATENCY" value={metricsLatency} />
                  <Card2Field
                    name="ETH HEIGHT REMAINING"
                    value={node?.metricsData?.eth_height_remaining}
                  />
                  <StyledProgressBar
                    $percent={relativeETHHeightPercent || 0}
                    $color="main0"
                  />
                  <Card2Field
                    name="linked resources"
                    value={
                      <NodeLinkedNodes
                        nodes={node?.crnsData}
                        subfix=" linked"
                      />
                    }
                  />
                </Card2>
                <Card2 title="POTENTIAL REWARD">
                  <Card2Field
                    name="ESTIMATED MONTHLY REWARD"
                    value={<Price value={calculatedRewards} />}
                  />
                </Card2>
              </div>
              <div tw="flex-1 w-1/3 min-w-[20rem] flex flex-col gap-9">
                <Card2 title="LINKED RESOURCES">
                  {Array.from(
                    {
                      length: Math.max(
                        NodeManager.maxLinkedPerNode,
                        node?.crnsData.length || 0,
                      ),
                    },
                    (_, i) => {
                      const crn = node?.crnsData[i]

                      return (
                        <div key={i} tw="flex gap-3 items-center">
                          {!crn ? (
                            <>
                              <LinkedStatusDotIcon />
                              <div tw="w-6 h-6 rounded-full bg-[#C4C4C433]" />
                              <div className="fs-10" tw="leading-4">
                                {isOwner ? (
                                  <ButtonLink
                                    href="/account/earn/crn"
                                    color="main0"
                                    size="md"
                                    kind="gradient"
                                    variant="textOnly"
                                  >
                                    <div>
                                      <Icon name="link" tw="w-3.5 h-3.5" /> link
                                      now
                                    </div>
                                  </ButtonLink>
                                ) : (
                                  <>not linked</>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <LinkedStatusDotIcon $score={crn.score} />
                              <Link
                                href={`/account/earn/crn/${crn.hash}`}
                                legacyBehavior
                              >
                                <NodeName
                                  hash={crn.hash}
                                  name={crn.name}
                                  picture={crn.picture}
                                  tw="mr-auto w-auto cursor-pointer"
                                  apiServer={apiServer}
                                  ImageCmp={Image}
                                />
                              </Link>
                              {isUnlinkableByUser(crn) && (
                                <ButtonWithInfoTooltip
                                  kind="flat"
                                  variant="textOnly"
                                  onClick={() => handleUnlink(crn)}
                                  disabled={!isEthereumNetwork}
                                  tooltipContent={
                                    !isEthereumNetwork
                                      ? unsupportedNetworkDisabledMessage(
                                          blockchainName,
                                        )
                                      : undefined
                                  }
                                  tooltipPosition={{
                                    my: 'bottom-center',
                                    at: 'top-center',
                                  }}
                                >
                                  <Icon name="trash" color="error" />
                                </ButtonWithInfoTooltip>
                              )}
                            </>
                          )}
                        </div>
                      )
                    },
                  )}
                </Card2>
                <Card2 title="PERFORMANCE">
                  {/* <Card2Field name="AVERAGE RESPONSE" value="?????" />
              <Card2Field name="RESPONSIVENESS" value="?????" /> */}
                  <Card2Field
                    name="TOTAL STAKED"
                    value={<Price value={node?.total_staked} />}
                  />
                  {/* <Card2Field name="TIME LEFT" value="?????" />
              <Card2Field name="UPTIME" value="?????" /> */}
                  <Card2Field name="CREATION TIME" value={creationDate} />
                </Card2>
              </div>
            </div>
          </div>
        </section>
      </CenteredContainer>
    </>
  )
}
CoreChannelNodeDetailPage.displayName = 'CoreChannelNodeDetailPage'

export default memo(CoreChannelNodeDetailPage)
