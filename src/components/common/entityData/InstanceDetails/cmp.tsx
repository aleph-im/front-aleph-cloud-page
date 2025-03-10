import React, { memo } from 'react'
import {
  NoisyContainer,
  ObjectImg,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { InstanceDetailsProps } from './types'
import Skeleton from '../../Skeleton'
import IconText from '../../IconText'
import { Text } from '@/components/pages/dashboard/common'
import { convertByteUnits, ellipseText } from '@/helpers/utils'

export const InstanceDetails = ({ instance }: InstanceDetailsProps) => {
  const handleCopyHash = useCopyToClipboardAndNotify(instance?.id || '')

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        INSTANCE DETAILS
      </div>
      <NoisyContainer>
        <div tw="flex gap-4">
          <ObjectImg
            id="Object11"
            color="main0"
            size="6rem"
            tw="min-w-[7rem] min-h-[7rem]"
          />
          <div tw="flex flex-col gap-4 w-full">
            <div tw="w-full">
              <div className="tp-info text-main0 fs-12">ITEM HASH</div>
              {instance ? (
                <IconText iconName="copy" onClick={handleCopyHash}>
                  {instance.id}
                </IconText>
              ) : (
                <Skeleton width="100%" />
              )}
            </div>
            <div tw="flex flex-wrap gap-4">
              <div>
                <div className="tp-info text-main0 fs-12">CORES</div>
                <div>
                  <Text tw="flex items-center gap-1">
                    {instance?.resources ? (
                      `${instance.resources.vcpus} x86 64bit`
                    ) : (
                      <Skeleton width="7rem" />
                    )}
                  </Text>
                </div>
              </div>
              <div>
                <div className="tp-info text-main0 fs-12">RAM</div>
                <div>
                  <Text>
                    {instance?.resources ? (
                      convertByteUnits(instance.resources.memory, {
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
                <div className="tp-info text-main0 fs-12">HDD</div>
                <div>
                  <Text>
                    {instance ? (
                      convertByteUnits(instance.size, {
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
              <div className="tp-info text-main0 fs-12">EXPLORER</div>
              <div>
                {instance ? (
                  <a
                    className="tp-body1 fs-16"
                    href={instance.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <IconText iconName="square-up-right">
                      <Text>{ellipseText(instance.url, 80)}</Text>
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
InstanceDetails.displayName = 'InstanceDetails'

export default memo(InstanceDetails) as typeof InstanceDetails
