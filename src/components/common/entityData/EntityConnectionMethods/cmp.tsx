import React, { memo } from 'react'
import { NoisyContainer, Tabs } from '@aleph-front/core'
import { EntityConnectionMethodsProps } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import IconText from '../../IconText'
import { useEntityConnectionMethods } from './hook'
import InfoTitle from '../InfoTitle'

export const EntityConnectionMethods = ({
  executableStatus,
  sshForwardedPort,
}: EntityConnectionMethodsProps) => {
  const {
    isLoading,
    formattedIPv4,
    formattedIPv6,
    formattedIpv4SSHCommand,
    formattedIpv6SSHCommand,
    handleCopyIpv4,
    handleCopyIpv6,
    handleCopyIpv4Command,
    handleCopyIpv6Command,
  } = useEntityConnectionMethods({ executableStatus, sshForwardedPort })

  const [tabSelected, setTabSelected] = React.useState<'ipv4' | 'ipv6'>('ipv4')

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        CONNECTION METHODS
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <Tabs
            selected={tabSelected}
            onTabChange={() => {
              setTabSelected(tabSelected === 'ipv4' ? 'ipv6' : 'ipv4')
            }}
            align="left"
            tabs={[
              {
                id: 'ipv4',
                name: 'ipv4',
              },
              {
                id: 'ipv6',
                name: 'ipv6',
              },
            ]}
            tw="overflow-hidden -mt-3"
          />
          <div>
            <InfoTitle>SSH COMMAND</InfoTitle>
            <div>
              {!isLoading ? (
                <IconText
                  iconName="copy"
                  onClick={() => {
                    if (tabSelected === 'ipv4') {
                      handleCopyIpv4Command()
                    } else {
                      handleCopyIpv6Command()
                    }
                  }}
                >
                  <Text>
                    &gt;_{' '}
                    {tabSelected === 'ipv4'
                      ? formattedIpv4SSHCommand
                      : formattedIpv6SSHCommand}
                  </Text>
                </IconText>
              ) : (
                <Skeleton width="20rem" />
              )}
            </div>
          </div>
          <div>
            <InfoTitle>{tabSelected === 'ipv4' ? 'IPV4' : 'IPV6'}</InfoTitle>
            <div>
              {!isLoading ? (
                <IconText
                  iconName="copy"
                  onClick={() => {
                    if (tabSelected === 'ipv4') {
                      handleCopyIpv4()
                    } else {
                      handleCopyIpv6()
                    }
                  }}
                >
                  <Text>
                    {tabSelected === 'ipv4' ? formattedIPv4 : formattedIPv6}
                  </Text>
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
