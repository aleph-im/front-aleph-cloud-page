import React, { memo } from 'react'
import { NoisyContainer, ObjectImg } from '@aleph-front/core'
import { DomainLinkedResourceProps } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import {
  EntityDomainTypeName,
  EntityType,
  EntityTypeObject,
  NAVIGATION_URLS,
} from '@/helpers/constants'
import InfoTitle from '../InfoTitle'
import Link from 'next/link'
import RelatedEntityCard from '../RelatedEntityCard'

export const DomainLinkedResource = ({
  domain,
  refEntity,
}: DomainLinkedResourceProps) => {
  const getEntityUrl = () => {
    if (!domain || !refEntity) return ''

    const baseUrl =
      domain.target === 'instance'
        ? NAVIGATION_URLS.console.computing.instances.home
        : domain.target === 'confidential'
          ? NAVIGATION_URLS.console.computing.confidentials.home
          : domain.target === 'program'
            ? NAVIGATION_URLS.console.computing.functions.home
            : NAVIGATION_URLS.console.storage.volumes.home

    return `${baseUrl}/${refEntity.id}`
  }

  const getEntityType = () => {
    if (!domain) return EntityType.Instance

    switch (domain.target) {
      case 'instance':
        return EntityType.Instance
      case 'confidential':
        return EntityType.Confidential
      case 'program':
        return EntityType.Program
      default:
        return EntityType.Volume
    }
  }

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        LINKED
      </div>
      <NoisyContainer>
        {domain && refEntity ? (
          <Link href={getEntityUrl()} passHref legacyBehavior>
            <a tw="no-underline">
              <RelatedEntityCard onClick={() => null}>
                <ObjectImg
                  id={EntityTypeObject[getEntityType()]}
                  color="base2"
                  size="2.5rem"
                  tw="min-w-[3rem] min-h-[3rem]"
                />
                <div>
                  <InfoTitle>
                    {EntityDomainTypeName[domain.target]?.toUpperCase()}
                  </InfoTitle>
                  <Text>
                    {'name' in refEntity && refEntity.name
                      ? refEntity.name
                      : refEntity.id}
                  </Text>
                </div>
              </RelatedEntityCard>
            </a>
          </Link>
        ) : domain && !refEntity ? (
          <Text>The target resource is missing or has been deleted.</Text>
        ) : (
          <div tw="flex flex-col gap-4">
            <RelatedEntityCard disabled onClick={() => null}>
              <ObjectImg
                id={EntityTypeObject[EntityType.Instance]}
                color="base2"
                size="2.5rem"
                tw="min-w-[3rem] min-h-[3rem]"
              />
              <div>
                <InfoTitle>RESOURCE</InfoTitle>
                <Text>
                  <Skeleton width="7rem" />
                </Text>
              </div>
            </RelatedEntityCard>
          </div>
        )}
      </NoisyContainer>
    </>
  )
}
DomainLinkedResource.displayName = 'DomainLinkedResource'

export default memo(DomainLinkedResource) as typeof DomainLinkedResource
