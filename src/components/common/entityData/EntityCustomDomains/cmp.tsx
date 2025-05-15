import React, { memo } from 'react'
import { Icon, NoisyContainer, ObjectImg } from '@aleph-front/core'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import RelatedEntityCard from '../RelatedEntityCard'
import { EntityCustomDomainsProps } from './types'
import { EntityType, EntityTypeObject } from '@/helpers/constants'

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
              (customDomain) =>
                customDomain && (
                  <RelatedEntityCard
                    key={customDomain.id}
                    onClick={() => {
                      handleCustomDomainClick(customDomain)
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
                      <Text>{customDomain.name}</Text>
                    </div>
                    <Icon
                      name="eye"
                      tw="absolute top-2 right-2"
                      className="openEntityIcon"
                    />
                  </RelatedEntityCard>
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
