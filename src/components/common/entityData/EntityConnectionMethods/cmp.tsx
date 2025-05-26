import React, { memo } from 'react'
import { NoisyContainer } from '@aleph-front/core'
import { EntityConnectionMethodsProps } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import IconText from '../../IconText'
import { useEntityConnectionMethods } from './hook'
import InfoTitle from '../InfoTitle'

export const EntityConnectionMethods = ({
  executableStatus,
}: EntityConnectionMethodsProps) => {
  const {
    isLoading,
    formattedIPv6,
    formattedSSHCommand,
    handleCopyIpv6,
    handleCopyCommand,
  } = useEntityConnectionMethods({ executableStatus })

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        CONNECTION METHODS
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div>
            <InfoTitle>SSH COMMAND</InfoTitle>
            <div>
              {!isLoading ? (
                <IconText iconName="copy" onClick={handleCopyCommand}>
                  <Text>&gt;_ {formattedSSHCommand}</Text>
                </IconText>
              ) : (
                <Skeleton width="20rem" />
              )}
            </div>
          </div>
          <div>
            <InfoTitle>IPV6</InfoTitle>
            <div>
              {!isLoading ? (
                <IconText iconName="copy" onClick={handleCopyIpv6}>
                  <Text>{formattedIPv6}</Text>
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
