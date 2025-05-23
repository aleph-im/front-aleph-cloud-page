import React, { memo } from 'react'
import {
  NoisyContainer,
  ObjectImg,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { ProgramDetailsProps } from './types'
import Skeleton from '../../Skeleton'
import IconText from '../../IconText'
import { Text } from '@/components/pages/console/common'
import {
  convertByteUnits,
  ellipseText,
  humanReadableSize,
} from '@/helpers/utils'
import { EntityType, EntityTypeObject } from '@/helpers/constants'
import InfoTitle from '../InfoTitle'

export const ProgramDetails = ({ program }: ProgramDetailsProps) => {
  const handleCopyHash = useCopyToClipboardAndNotify(program?.id || '')

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        FUNCTION DETAILS
      </div>
      <NoisyContainer>
        <div tw="flex gap-4">
          <ObjectImg
            id={EntityTypeObject[EntityType.Program]}
            color="main0"
            size="6rem"
            tw="min-w-[7rem] min-h-[7rem]"
          />
          <div tw="flex flex-col gap-4 w-full">
            <div tw="w-full">
              <InfoTitle>ITEM HASH</InfoTitle>
              {program ? (
                <IconText iconName="copy" onClick={handleCopyHash}>
                  {program.id}
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
                    {program?.resources ? (
                      `${program.resources.vcpus} x86 64bit`
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
                    {program?.resources ? (
                      convertByteUnits(program.resources.memory, {
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
                <InfoTitle>TIMEOUT</InfoTitle>
                <div>
                  <Text>
                    {program ? (
                      `${program.resources.seconds}s`
                    ) : (
                      <Skeleton width="6rem" />
                    )}
                  </Text>
                </div>
              </div>
              <div>
                <InfoTitle>SIZE</InfoTitle>
                <div>
                  <Text>
                    {program ? (
                      humanReadableSize(program.size || 0, 'MiB')
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
                {program ? (
                  <a
                    className="tp-body1 fs-16"
                    href={program.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <IconText iconName="square-up-right">
                      <Text>{ellipseText(program.url, 80)}</Text>
                    </IconText>
                  </a>
                ) : (
                  <Skeleton width="20rem" />
                )}
              </div>
            </div>
            <div>
              <InfoTitle>API ENTRYPOINT</InfoTitle>
              <div>
                {program ? (
                  <a
                    className="tp-body1 fs-16"
                    href={program.urlVM}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <IconText iconName="square-up-right">
                      <Text>{ellipseText(program.urlVM, 80)}</Text>
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
ProgramDetails.displayName = 'ProgramDetails'

export default memo(ProgramDetails) as typeof ProgramDetails
