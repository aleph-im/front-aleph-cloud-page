import React, { memo } from 'react'
import { NoisyContainer } from '@aleph-front/core'
import { EntityConnectionMethodsProps } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/dashboard/common'
import IconText from '../../IconText'
import { useEntityConnectionMethods } from './hook'

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
            <div className="tp-info text-main0 fs-12">SSH COMMAND</div>
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
            <div className="tp-info text-main0 fs-12">IPV6</div>
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
