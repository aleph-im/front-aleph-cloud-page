import React, { memo, useRef } from 'react'
import { Icon, NoisyContainer, ObjectImg, Spinner } from '@aleph-front/core'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import RelatedEntityCard from '../RelatedEntityCard'
import { EntityCustomDomainsProps } from './types'
import { EntityType, EntityTypeObject } from '@/helpers/constants'
import ResponsiveTooltip from '../../ResponsiveTooltip'

const DomainCard = ({
  domain,
  status,
  onDomainClick: handleDomainClick,
}: {
  domain: EntityCustomDomainsProps['customDomains'][number]['domain']
  status: EntityCustomDomainsProps['customDomains'][number]['status']
  onDomainClick: EntityCustomDomainsProps['onCustomDomainClick']
}) => {
  const warningIconRef = useRef(null)

  return (
    <RelatedEntityCard
      key={domain.id}
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
        <div className="tp-info text-main0 fs-12">DOMAIN</div>
        <div tw="flex items-center gap-2">
          {!status ? (
            <Spinner color="main0" size="3em" tw="-m-4" />
          ) : (
            !status.status && (
              <>
                <div ref={warningIconRef}>
                  <Icon size="xl" name="warning" color="warning" />
                </div>
                <ResponsiveTooltip
                  my={'bottom-center'}
                  at={'top-center'}
                  targetRef={warningIconRef}
                  content={status.help}
                />
              </>
            )
          )}
          <Text>{domain.name}</Text>
        </div>
      </div>
      <Icon name="eye" tw="absolute top-2 right-2" className="openEntityIcon" />
    </RelatedEntityCard>
  )
}

export const EntityCustomDomains = ({
  customDomains,
  onCustomDomainClick: handleCustomDomainClick,
}: EntityCustomDomainsProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        CUSTOM DOMAINS
      </div>
      <NoisyContainer>
        <div tw="flex flex-wrap gap-4">
          {customDomains.length ? (
            customDomains.map(
              ({ domain, status }) =>
                domain && (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    status={status}
                    onDomainClick={handleCustomDomainClick}
                  />
                ),
            )
          ) : (
            <RelatedEntityCard disabled onClick={() => null}>
              <ObjectImg
                id={EntityTypeObject[EntityType.Domain]}
                color="base2"
                size="2.5rem"
                tw="min-w-[3rem] min-h-[3rem]"
              />
              <div>
                <div className="tp-info text-main0 fs-12">DOMAIN</div>
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
          )}
        </div>
      </NoisyContainer>
    </>
  )
}
EntityCustomDomains.displayName = 'EntityCustomDomains'

export default memo(EntityCustomDomains) as typeof EntityCustomDomains
