import React, { memo, useRef } from 'react'
import { Icon, NoisyContainer, ObjectImg, Spinner } from '@aleph-front/core'
import Skeleton from '../../Skeleton'
import { DisabledText, Text } from '@/components/pages/console/common'
import RelatedEntityCard from '../RelatedEntityCard'
import { EntityCustomDomainsProps } from './types'
import { EntityType, EntityTypeObject } from '@/helpers/constants'
import ResponsiveTooltip from '../../ResponsiveTooltip'
import InfoTitle from '../InfoTitle'
import FunctionalButton from '../../FunctionalButton'

const DomainCard = ({
  domain,
  onDomainClick: handleDomainClick,
}: {
  domain: EntityCustomDomainsProps['customDomains'][number]
  onDomainClick: EntityCustomDomainsProps['onCustomDomainClick']
}) => {
  const warningIconRef = useRef(null)

  const { id, name, status } = domain

  return (
    <RelatedEntityCard
      key={id}
      onClick={() => {
        handleDomainClick(domain)
      }}
    >
      <ObjectImg
        id={EntityTypeObject[EntityType.Domain]}
        color="base2"
        size="2.5rem"
        tw="min-w-[3rem] min-h-[3rem]"
      />
      <div>
        <InfoTitle>DOMAIN</InfoTitle>
        <div tw="flex items-center gap-2">
          <Text>{name}</Text>
          {!status ? (
            <Spinner color="main0" size="3em" tw="-m-4" />
          ) : (
            !status.status && (
              <>
                <div ref={warningIconRef}>
                  <Icon size="md" name="warning" color="warning" />
                </div>
                <ResponsiveTooltip
                  my={'bottom-right'}
                  at={'top-center'}
                  targetRef={warningIconRef}
                  content={status.help}
                />
              </>
            )
          )}
        </div>
      </div>

      <Icon name="eye" tw="absolute top-2 right-2" className="openEntityIcon" />
    </RelatedEntityCard>
  )
}

export const EntityCustomDomains = ({
  isLoadingCustomDomains,
  customDomains,
  onCustomDomainClick: handleCustomDomainClick,
  onAddDomain: handleAddDomain,
}: EntityCustomDomainsProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        CUSTOM DOMAINS
      </div>
      <NoisyContainer>
        <div tw="flex flex-wrap gap-4">
          {isLoadingCustomDomains ? (
            <RelatedEntityCard disabled onClick={() => null}>
              <ObjectImg
                id={EntityTypeObject[EntityType.Domain]}
                color="base2"
                size="2.5rem"
                tw="min-w-[3rem] min-h-[3rem]"
              />
              <div>
                <InfoTitle>DOMAIN</InfoTitle>
                <Text>
                  <Skeleton width="7rem" />
                </Text>
              </div>
              <Icon
                name="eye"
                tw="absolute top-2 right-2"
                className="openEntityIcon"
              />
            </RelatedEntityCard>
          ) : customDomains.length ? (
            customDomains.map(
              (domain) =>
                domain && (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    onDomainClick={handleCustomDomainClick}
                  />
                ),
            )
          ) : (
            <div tw="flex flex-col gap-4">
              <div>
                <FunctionalButton onClick={handleAddDomain}>
                  <Icon name="globe" />
                  set custom domain
                </FunctionalButton>
              </div>
              <div tw="flex flex-col gap-2.5">
                <div>
                  <InfoTitle>INFO</InfoTitle>
                  <Text>
                    You&apos;ll need to add DNS records at your domain provider
                    to verify ownership and route traffic to this instance.
                  </Text>
                </div>
                <DisabledText>
                  (Changes usually propagate within a few minutes, but may take
                  longer depending on your provider).
                </DisabledText>
              </div>
            </div>
          )}
        </div>
      </NoisyContainer>
    </>
  )
}
EntityCustomDomains.displayName = 'EntityCustomDomains'

export default memo(EntityCustomDomains) as typeof EntityCustomDomains
