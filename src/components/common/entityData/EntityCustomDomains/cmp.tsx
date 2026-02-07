import React, { memo, useCallback, useState } from 'react'
import { Button, Icon, NoisyContainer } from '@aleph-front/core'
import { DisabledText, Text } from '@/components/pages/console/common'
import { EntityCustomDomainsProps } from './types'
import InfoTitle from '../InfoTitle'
import FunctionalButton from '../../FunctionalButton'
import DomainNameSection from '../DomainNameSection'
import Skeleton from '../../Skeleton'

export const EntityCustomDomains = ({
  isLoadingCustomDomains,
  customDomains,
  onCustomDomainClick: handleCustomDomainClick,
  onCreateDomain,
}: EntityCustomDomainsProps) => {
  const [isAdding, setIsAdding] = useState(false)

  const handleCreateDomain = useCallback(
    async (name: string) => {
      await onCreateDomain(name)
      setIsAdding(false)
    },
    [onCreateDomain],
  )

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        CUSTOM DOMAINS
      </div>
      {isLoadingCustomDomains ? (
        <NoisyContainer>
          <div tw="p-6 flex flex-col gap-4" className="bg-background">
            <Skeleton width="100%" height="2.5rem" />
          </div>
        </NoisyContainer>
      ) : (
        <NoisyContainer>
          <div tw="flex flex-col gap-4">
            {customDomains.map(
              (domain) =>
                domain && (
                  <DomainNameSection
                    key={domain.id}
                    domain={domain}
                    status={domain.status}
                    onConfigure={() => handleCustomDomainClick(domain)}
                    hideTitle
                    noContainer
                  />
                ),
            )}

            {isAdding && (
              <DomainNameSection
                defaultEditing
                onSave={handleCreateDomain}
                hideTitle
                noContainer
              />
            )}
            <div>
              <Button
                variant="secondary"
                kind="gradient"
                onClick={() => setIsAdding((prev) => !prev)}
              >
                {isAdding ? 'Cancel' : 'Add custom domain'}
              </Button>
            </div>
            {!customDomains.length && !isAdding && (
              <div tw="p-6 flex flex-col gap-2.5" className="bg-background">
                <div tw="flex gap-1.5 flex-col">
                  <InfoTitle>WARNING</InfoTitle>
                  <div>
                    <Text>
                      You&apos;ll need to add DNS records at your domain
                      provider to verify ownership and route traffic to this
                      instance.
                    </Text>{' '}
                    <DisabledText>
                      (Changes usually propagate within a few minutes, but may
                      take longer depending on your provider).
                    </DisabledText>
                  </div>
                </div>
              </div>
            )}
          </div>
        </NoisyContainer>
      )}
    </>
  )
}
EntityCustomDomains.displayName = 'EntityCustomDomains'

export default memo(EntityCustomDomains) as typeof EntityCustomDomains
