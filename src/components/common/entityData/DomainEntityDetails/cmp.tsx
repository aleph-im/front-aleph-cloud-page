import React, { memo } from 'react'
import { NoisyContainer, ObjectImg } from '@aleph-front/core'
import { DomainEntityDetailsProps } from './types'
import Skeleton from '../../Skeleton'
import IconText from '../../IconText'
import { Text } from '@/components/pages/console/common'
import {
  EntityDomainTypeName,
  EntityType,
  EntityTypeObject,
} from '@/helpers/constants'
import InfoTitle from '../InfoTitle'

export const DomainEntityDetails = ({
  domain,
  onCopyRef: handleCopyRef,
}: DomainEntityDetailsProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        DETAILS
      </div>
      <NoisyContainer>
        <div tw="flex gap-4">
          <ObjectImg
            id={EntityTypeObject[EntityType.Domain]}
            color="main0"
            size="6rem"
            tw="min-w-[7rem] min-h-[7rem]"
          />
          <div tw="flex flex-col gap-4 w-full">
            <div tw="flex flex-wrap gap-6">
              <div>
                <InfoTitle>TARGET</InfoTitle>
                <div>
                  <Text>
                    {domain ? (
                      (domain.target && EntityDomainTypeName[domain.target]) ||
                      '-'
                    ) : (
                      <Skeleton width="5rem" />
                    )}
                  </Text>
                </div>
              </div>
              <div>
                <InfoTitle>UPDATED ON</InfoTitle>
                <div>
                  {domain ? (
                    <Text className="fs-10 tp-body1">{domain.date}</Text>
                  ) : (
                    <Skeleton width="8rem" />
                  )}
                </div>
              </div>
            </div>
            <div tw="w-full">
              <InfoTitle>REF</InfoTitle>
              {domain ? (
                <IconText iconName="copy" onClick={handleCopyRef}>
                  <Text>{domain.ref}</Text>
                </IconText>
              ) : (
                <Skeleton width="100%" />
              )}
            </div>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
DomainEntityDetails.displayName = 'DomainEntityDetails'

export default memo(DomainEntityDetails) as typeof DomainEntityDetails
