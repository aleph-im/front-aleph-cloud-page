import React, { memo } from 'react'
import { NoisyContainer } from '@aleph-front/core'
import { EntityProxyUrlProps } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import IconText from '../../IconText'
import InfoTitle from '../InfoTitle'
import { useEntityProxyUrl } from './hook'

export const EntityProxyUrl = ({ instanceHash }: EntityProxyUrlProps) => {
  const { data, loading } = useEntityProxyUrl(instanceHash)

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        WEB ACCESS
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div>
            <InfoTitle>PROXY URL</InfoTitle>
            <div>
              {loading ? (
                <Skeleton width="16rem" />
              ) : data ? (
                <a
                  className="tp-body1 fs-16"
                  href={`https://${data.url}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{data.url}</Text>
                  </IconText>
                </a>
              ) : (
                <Text>Unavailable</Text>
              )}
            </div>
          </div>
          <div>
            <InfoTitle>INFO</InfoTitle>
            <Text className="fs-12" tw="opacity-60">
              If your instance runs a web server, it&apos;s already accessible
              at this URL. HTTPS traffic is forwarded transparently (L4), so
              you&apos;ll need to handle TLS certificates on your instance.
              HTTP traffic (port 80) is also forwarded.
            </Text>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityProxyUrl.displayName = 'EntityProxyUrl'

export default memo(EntityProxyUrl) as typeof EntityProxyUrl
