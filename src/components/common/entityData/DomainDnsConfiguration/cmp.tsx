import React, { memo } from 'react'
import { BulletItem, Button, NoisyContainer } from '@aleph-front/core'
import { DomainDnsConfigurationProps } from './types'
import { DisabledText, Text } from '@/components/pages/console/common'
import { EntityDomainType } from '@/helpers/constants'

export const DomainDnsConfiguration = ({
  domain,
  status,
  account,
  onRetry: handleRetry,
}: DomainDnsConfigurationProps) => {
  if (!domain || !status) return null

  const allConfigured =
    status.tasks_status.cname && status.tasks_status.owner_proof

  return (
    <div id="dns-configuration">
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        DNS CONFIGURATION
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <DisabledText>
            Add the following DNS records at your domain provider to verify
            ownership and route traffic to this instance.
          </DisabledText>

          <div tw="flex flex-col gap-3 mt-2">
            {/* CNAME Record */}
            <div tw="flex items-start gap-2">
              <BulletItem
                kind={status.tasks_status.cname ? 'success' : 'warning'}
                title=""
              />
              <div tw="flex flex-col">
                <Text tw="font-semibold">CNAME</Text>
                <Text>
                  <span className="text-main0">{domain.name}</span>
                  <span tw="mx-2">→</span>
                  {domain.target === EntityDomainType.Program && (
                    <span className="text-main0">
                      {domain.name}.program.public.aleph.sh
                    </span>
                  )}
                  {[
                    EntityDomainType.Instance,
                    EntityDomainType.Confidential,
                  ].includes(domain.target) && (
                    <span className="text-main0">
                      {domain.name}.instance.public.aleph.sh
                    </span>
                  )}
                  {domain.target === EntityDomainType.IPFS && (
                    <span className="text-main0">ipfs.public.aleph.sh</span>
                  )}
                </Text>
              </div>
            </div>

            {/* DNSLINK CNAME Record (for IPFS) */}
            {domain.target === EntityDomainType.IPFS && (
              <div tw="flex items-start gap-2">
                <BulletItem
                  kind={status.tasks_status.delegation ? 'success' : 'warning'}
                  title=""
                />
                <div tw="flex flex-col">
                  <Text tw="font-semibold">CNAME</Text>
                  <Text>
                    <span className="text-main0">_dnslink.{domain.name}</span>
                    <span tw="mx-2">→</span>
                    <span className="text-main0">
                      _dnslink.{domain.name}.static.public.aleph.sh
                    </span>
                  </Text>
                </div>
              </div>
            )}

            {/* TXT Record (ownership proof) */}
            <div tw="flex items-start gap-2">
              <BulletItem
                kind={status.tasks_status.owner_proof ? 'success' : 'warning'}
                title=""
              />
              <div tw="flex flex-col">
                <Text tw="font-semibold">
                  TXT <span tw="font-normal">(ownership proof)</span>
                </Text>
                <Text>
                  <span className="text-main0">_control.{domain.name}</span>
                  <span tw="mx-2">→</span>
                  <span className="text-main0">{account?.address}</span>
                </Text>
              </div>
            </div>
          </div>

          {!allConfigured && (
            <div tw="mt-4">
              <Button
                onClick={handleRetry}
                size="md"
                variant="secondary"
                color="main0"
                kind="default"
              >
                Retry verification
              </Button>
            </div>
          )}
        </div>
      </NoisyContainer>
    </div>
  )
}
DomainDnsConfiguration.displayName = 'DomainDnsConfiguration'

export default memo(DomainDnsConfiguration) as typeof DomainDnsConfiguration
