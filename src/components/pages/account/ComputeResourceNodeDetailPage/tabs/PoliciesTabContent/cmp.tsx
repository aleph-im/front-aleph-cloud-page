import { memo, useMemo } from 'react'
import { UseComputeResourceNodeDetailPageReturn } from '@/components/pages/account/ComputeResourceNodeDetailPage/hook'
import Card2, { Card2Field } from '@/components/common/Card2'
import {
  Col,
  ellipseText,
  FileInput,
  Icon,
  Row,
  Spinner,
} from '@aleph-front/core'
import { useAppState } from '@/contexts/appState'
import { BlockchainId, blockchains } from '@/domain/connect'
import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { unsupportedNetworkDisabledMessage } from '@/components/pages/account/disabledMessages'
import ExternalLink from '@/components/common/ExternalLink'
import { usePoliciesTabContent } from './hook'

export type PoliciesTabContentProps = Pick<
  UseComputeResourceNodeDetailPageReturn,
  'termsAndConditionsCtrl' | 'handleRemovePolicies' | 'node' | 'isOwner'
>

export const PoliciesTabContent = (props: PoliciesTabContentProps) => {
  const {
    isOwner,
    documentName,
    documentCID,
    documentLink,
    termsAndConditionsCtrl,
    isLoadingHistoryMessages,
    policiesHistory,
    fileValue,
    removePoliciesDisabled,
    isCurrentVersion,
    handleFileChange,
    handleDownloadFile,
    handleRemovePolicies,
  } = usePoliciesTabContent(props)

  const [state] = useAppState()
  const { blockchain } = state.connection

  const isEthereumNetwork = useMemo(() => {
    return blockchain === BlockchainId.ETH
  }, [blockchain])

  const blockchainName = useMemo(() => {
    return blockchain ? blockchains[blockchain]?.name : 'Current network'
  }, [blockchain])

  return (
    <section tw="mt-8">
      <Row count={1} xl={5} xlGap={'2rem'}>
        <Col span={3}>
          <Card2 title="CURRENT VERSION">
            <Card2Field name="DOCUMENT NAME" value={documentName} />
            <Card2Field name="CID" value={documentCID} />
            <Card2Field name="LINK" value={documentLink} />
          </Card2>
          {isOwner && (
            <>
              <ButtonWithInfoTooltip
                kind="flat"
                variant="secondary"
                size="md"
                color="error"
                onClick={handleRemovePolicies}
                tw="my-8!"
                disabled={removePoliciesDisabled || !isEthereumNetwork}
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
                <Icon
                  name="trash"
                  color={
                    removePoliciesDisabled || !isEthereumNetwork ? '' : 'error'
                  }
                  size="lg"
                />
                remove policies
              </ButtonWithInfoTooltip>
              <FileInput
                {...termsAndConditionsCtrl.field}
                {...termsAndConditionsCtrl.fieldState}
                value={fileValue}
                onChange={handleFileChange}
              />
              <div
                tw="mt-2 pr-7 w-full text-right opacity-70"
                className="tp-info text-base"
              >
                Max. file size is 100 MB
              </div>
            </>
          )}
        </Col>
        <Col span={2}>
          <div className="tp-h7" tw="my-8">
            History
          </div>
          {isLoadingHistoryMessages ? (
            <Spinner />
          ) : (
            policiesHistory && (
              <ol>
                {Array.from(policiesHistory).map(([, policies], index) => (
                  <li key={policies.cid} tw="mt-2">
                    <div
                      className="fs-12"
                      tw="italic font-normal opacity-40 mb-0.5"
                    >
                      {isCurrentVersion(policies)
                        ? 'Now'
                        : policies.time.toLocaleDateString()}
                    </div>
                    <ExternalLink
                      text={policies.name || ellipseText(policies.cid, 12, 6)}
                      href="#"
                      onClick={() =>
                        handleDownloadFile(
                          policies.cid,
                          policies.name || policies.cid,
                        )
                      }
                      target="_self"
                    />
                    {/* Don't render left line only for last element  */}
                    {index < policiesHistory.size - 1 && (
                      <div tw="ml-1 mt-2 h-8 relative border-s" />
                    )}
                  </li>
                ))}
              </ol>
            )
          )}
        </Col>
      </Row>
    </section>
  )
}
PoliciesTabContent.displayName = 'PoliciesTabContent'

export default memo(PoliciesTabContent)
