import React, { memo } from 'react'
import {
  NoisyContainer,
  ObjectImg,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { InstanceDetailsProps } from './types'
import Skeleton from '../../Skeleton'
import IconText from '../../IconText'
import { Text } from '@/components/pages/console/common'
import { convertByteUnits, ellipseText } from '@/helpers/utils'
import { EntityType, EntityTypeObject } from '@/helpers/constants'
import InfoTitle from '../InfoTitle'

export const InstanceEntityDetails = ({
  entity,
  title = 'INSTANCE',
}: InstanceDetailsProps) => {
  const handleCopyHash = useCopyToClipboardAndNotify(entity?.id || '')

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        {title} DETAILS
      </div>
      <NoisyContainer>
        <div tw="flex gap-4">
          <ObjectImg
            id={EntityTypeObject[EntityType.Instance]}
            color="main0"
            size="6rem"
            tw="min-w-[7rem] min-h-[7rem]"
          />
          <div tw="flex flex-col gap-4 w-full">
            <div tw="w-full">
              <InfoTitle>ITEM HASH</InfoTitle>
              {entity ? (
                <IconText iconName="copy" onClick={handleCopyHash}>
                  {entity.id}
                </IconText>
              ) : (
                <Skeleton width="100%" />
              )}
            </div>
            <div tw="flex flex-wrap gap-4">
              <div>
                <InfoTitle>CORES</InfoTitle>
                <div>
                  <Text tw="flex items-center gap-1">
                    {entity?.resources ? (
                      `${entity.resources.vcpus} x86 64bit`
                    ) : (
                      <Skeleton width="7rem" />
                    )}
                  </Text>
                </div>
              </div>
              <div>
                <InfoTitle>RAM</InfoTitle>
                <div>
                  <Text>
                    {entity?.resources ? (
                      convertByteUnits(entity.resources.memory, {
                        from: 'MiB',
                        to: 'GiB',
                        displayUnit: true,
                      })
                    ) : (
                      <Skeleton width="4rem" />
                    )}
                  </Text>
                </div>
              </div>
              <div>
                <InfoTitle>HDD</InfoTitle>
                <div>
                  <Text>
                    {entity ? (
                      convertByteUnits(entity.size, {
                        from: 'MiB',
                        to: 'GiB',
                        displayUnit: true,
                      })
                    ) : (
                      <Skeleton width="6rem" />
                    )}
                  </Text>
                </div>
              </div>
            </div>
            <div>
              <InfoTitle>EXPLORER</InfoTitle>
              <div>
                {entity ? (
                  <a
                    className="tp-body1 fs-16"
                    href={entity.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <IconText iconName="square-up-right">
                      <Text>{ellipseText(entity.url, 80)}</Text>
                    </IconText>
                  </a>
                ) : (
                  <Skeleton width="20rem" />
                )}
              </div>
            </div>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
InstanceEntityDetails.displayName = 'InstanceEntityDetails'

export default memo(InstanceEntityDetails) as typeof InstanceEntityDetails
