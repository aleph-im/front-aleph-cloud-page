import React, { memo } from 'react'
import { NoisyContainer, useCopyToClipboardAndNotify } from '@aleph-front/core'
import { EntityConnectionMethodsProps } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/dashboard/common'
import IconText from '../../IconText'

export const EntityConnectionMethods = ({
  executableStatus,
}: EntityConnectionMethodsProps) => {
  const handleCopyIpv6 = useCopyToClipboardAndNotify(
    executableStatus?.ipv6Parsed || '',
  )
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${executableStatus?.ipv6Parsed}`,
  )

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        CONNECTION METHODS
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div>
            <div className="tp-info text-main0 fs-12">SSH COMMAND</div>
            <div>
              {executableStatus ? (
                <IconText iconName="copy" onClick={handleCopyConnect}>
                  <Text>&gt;_ ssh root@{executableStatus.ipv6Parsed}</Text>
                </IconText>
              ) : (
                <Skeleton width="20rem" />
              )}
            </div>
          </div>
          <div>
            <div className="tp-info text-main0 fs-12">IPV6</div>
            <div>
              {executableStatus ? (
                <IconText iconName="copy" onClick={handleCopyIpv6}>
                  <Text>{executableStatus.ipv6Parsed}</Text>
                </IconText>
              ) : (
                <Skeleton width="10rem" />
              )}
            </div>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityConnectionMethods.displayName = 'EntityConnectionMethods'

export default memo(EntityConnectionMethods) as typeof EntityConnectionMethods
