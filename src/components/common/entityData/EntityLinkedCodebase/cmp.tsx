import React, { memo, useCallback } from 'react'
import {
  Icon,
  NoisyContainer,
  ObjectImg,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { EntityLinkedCodebaseProps } from './types'
import RelatedEntityCard from '../RelatedEntityCard'
import { FunctionalButton } from '@/components/pages/console/instance/ManageInstance/cmp'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import { EntityType, EntityTypeObject } from '@/helpers/constants'
import InfoTitle from '../InfoTitle'

export const EntityLinkedCodebase = ({
  loading,
  codebaseVolumeId,
  entrypoint,
  onCodebaseVolumeClick: handleCodebaseVolumeClick,
}: EntityLinkedCodebaseProps) => {
  const handleCopyVolumeHash = useCopyToClipboardAndNotify(
    codebaseVolumeId || '',
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
        LINKED CODEBASE
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div tw="flex flex-wrap items-center gap-4 -mt-2">
            <RelatedEntityCard
              disabled={!codebaseVolumeId}
              onClick={() =>
                codebaseVolumeId && handleCodebaseVolumeClick(codebaseVolumeId)
              }
            >
              <ObjectImg
                id={EntityTypeObject[EntityType.Volume]}
                color="base2"
                size="2.5rem"
                tw="min-w-[3rem] min-h-[3rem]"
              />
              <div>
                <InfoTitle>ENTRYPOINT</InfoTitle>
                <Text>
                  {!entrypoint || loading ? (
                    <Skeleton width="6rem" />
                  ) : (
                    entrypoint
                  )}
                </Text>
              </div>

              <Icon
                name="eye"
                tw="absolute top-2 right-2"
                className="openEntityIcon"
              />
            </RelatedEntityCard>
            <FunctionalButton
              onClick={handleCopyHash}
              disabled={!codebaseVolumeId}
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
EntityLinkedCodebase.displayName = 'EntityLinkedCodebase'

export default memo(EntityLinkedCodebase) as typeof EntityLinkedCodebase
