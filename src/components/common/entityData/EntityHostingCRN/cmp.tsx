import React, { memo, useEffect, useState } from 'react'
import { NoisyContainer } from '@aleph-front/core'
import { EntityHostingCRNProps, TermsAndConditions } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import IconText from '../../IconText'
import { ellipseText } from '@/helpers/utils'
import { StoreContent } from '@aleph-sdk/message'
import { useMessageManager } from '@/hooks/common/useManager/useMessageManager'
import InfoTitle from '../InfoTitle'

export const EntityHostingCRN = ({
  nodeDetails,
  termsAndConditionsHash,
}: EntityHostingCRNProps) => {
  const messageManager = useMessageManager()

  const [termsAndConditions, setTermsAndConditions] = useState<
    TermsAndConditions | undefined
  >()

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      if (!messageManager) return setTermsAndConditions(undefined)
      if (!termsAndConditionsHash) return setTermsAndConditions(undefined)

      try {
        const { content } = await messageManager.get(termsAndConditionsHash)
        const storeMessageContent = content as StoreContent

        if (!storeMessageContent) return setTermsAndConditions(undefined)

        const cid = storeMessageContent.item_hash
        const name = storeMessageContent.metadata?.name as string
        const url = `https://ipfs.aleph.im/ipfs/${cid}?filename=${name}`

        setTermsAndConditions({
          cid,
          name,
          url,
        })
      } catch (e) {
        console.error(e)
      }
    }

    fetchTermsAndConditions()
  }, [messageManager, termsAndConditionsHash])

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        HOSTING CRN
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div tw="flex gap-4">
            <div>
              <InfoTitle>NAME</InfoTitle>
              <div>
                <Text>
                  {nodeDetails ? nodeDetails.name : <Skeleton width="7rem" />}
                </Text>
              </div>
            </div>
            <div>
              <InfoTitle>URL</InfoTitle>
              <div>
                {nodeDetails ? (
                  <a
                    className="tp-body1 fs-16"
                    href={nodeDetails.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <IconText iconName="square-up-right">
                      <Text>{ellipseText(nodeDetails.url, 80)}</Text>
                    </IconText>
                  </a>
                ) : (
                  <Skeleton width="12rem" />
                )}
              </div>
            </div>
            <div>
              <InfoTitle>VERSION</InfoTitle>
              <div>
                <Text>
                  {nodeDetails ? (
                    nodeDetails.version
                  ) : (
                    <Skeleton width="4rem" />
                  )}
                </Text>
              </div>
            </div>
          </div>
          {termsAndConditions && (
            <div>
              <InfoTitle>ACCEPTED T&C</InfoTitle>
              <div>
                <a
                  className="tp-body1 fs-16"
                  href={termsAndConditions.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{termsAndConditions.name}</Text>
                  </IconText>
                </a>
              </div>
            </div>
          )}
        </div>
      </NoisyContainer>
    </>
  )
}
EntityHostingCRN.displayName = 'EntityHostingCRN'

export default memo(EntityHostingCRN) as typeof EntityHostingCRN
