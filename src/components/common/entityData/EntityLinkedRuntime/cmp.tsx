import React, { memo, useCallback } from 'react'
import {
  Icon,
  NoisyContainer,
  ObjectImg,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { EntityLinkedRuntimeProps } from './types'
import RelatedEntityCard from '../RelatedEntityCard'
import FunctionalButton from '@/components/common/FunctionalButton'
import Skeleton from '../../Skeleton'
import { ellipseText } from '@/helpers/utils'
import { EntityType, EntityTypeObject } from '@/helpers/constants'

export const EntityLinkedRuntime = ({
  loading,
  runtimeVolumeId,
  comment,
  onRuntimeVolumeClick: handleRuntimeVolumeClick,
}: EntityLinkedRuntimeProps) => {
  const handleCopyVolumeHash = useCopyToClipboardAndNotify(
    runtimeVolumeId || '',
  )

  const handleCopyHash = useCallback(
    (e: any) => {
      handleCopyVolumeHash()
      e.preventDefault()
    },
    [handleCopyVolumeHash],
  )

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        LINKED RUNTIME
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div tw="flex flex-wrap items-center gap-4">
            <RelatedEntityCard
              disabled={!runtimeVolumeId}
              onClick={() =>
                runtimeVolumeId && handleRuntimeVolumeClick(runtimeVolumeId)
              }
            >
              <ObjectImg
                id={EntityTypeObject[EntityType.Volume]}
                color="base2"
                size="2.5rem"
                tw="min-w-[3rem] min-h-[3rem]"
              />
              <div tw="flex flex-col items-start">
                <div className="tp-info">
                  {loading ? (
                    <Skeleton width="12rem" />
                  ) : (
                    (comment ?? ellipseText(runtimeVolumeId, 6, 12))
                  )}
                </div>
              </div>
              <Icon
                name="eye"
                tw="absolute top-2 right-2"
                className="openEntityIcon"
              />
            </RelatedEntityCard>
            <FunctionalButton
              onClick={handleCopyHash}
              disabled={!runtimeVolumeId}
            >
              <Icon name="copy" />
              copy hash
            </FunctionalButton>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityLinkedRuntime.displayName = 'EntityLinkedRuntime'

export default memo(EntityLinkedRuntime) as typeof EntityLinkedRuntime
