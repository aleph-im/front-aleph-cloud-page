import React, { memo, useEffect, useState } from 'react'
import { NoisyContainer } from '@aleph-front/core'
import { EntityHostingCRNProps, TermsAndConditions } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/dashboard/common'
import IconText from '../../IconText'
import { ellipseText } from '@/helpers/utils'
import { useAppState } from '@/contexts/appState'
import { StoreContent } from '@aleph-sdk/message'

export const EntityHostingCRN = ({
  nodeDetails,
  termsAndConditionsHash,
}: EntityHostingCRNProps) => {
  const [state] = useAppState()
  const {
    manager: { messageManager },
  } = state

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
              <div className="tp-info text-main0 fs-12">NAME</div>
              <div>
                <Text>
                  {nodeDetails ? nodeDetails.name : <Skeleton width="7rem" />}
                </Text>
              </div>
            </div>
            <div>
              <div className="tp-info text-main0 fs-12">URL</div>
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
          </div>
          {termsAndConditions && (
            <div>
              <div className="tp-info text-main0 fs-12">ACCEPTED T&C</div>
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
