import React, { memo, useCallback } from 'react'
import {
  Icon,
  NoisyContainer,
  ObjectImg,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { EntityLinkedVolumesProps } from './types'
import { Text } from '@/components/pages/dashboard/common'
import RelatedEntityCard from '../RelatedEntityCard'
import { humanReadableSize } from '@/helpers/utils'
import { FunctionalButton } from '@/components/pages/dashboard/ManageInstance/cmp'

export function LinkedVolumeItem({ volume, onClick }: any) {
  const handleCopyVolumeHash = useCopyToClipboardAndNotify(volume.id)

  const handleCopyHash = useCallback(
    (e: any) => {
      handleCopyVolumeHash()
      e.preventDefault()
    },
    [handleCopyVolumeHash],
  )

  return (
    <div tw="flex items-center gap-4">
      <RelatedEntityCard onClick={onClick}>
        <ObjectImg
          id="Object16"
          color="base2"
          size="2.5rem"
          tw="min-w-[3rem] min-h-[3rem]"
        />
        <div tw="flex flex-col items-start">
          <div className="tp-info">{volume.mount}</div>
          <Text className="fs-12">{humanReadableSize(volume.size, 'MiB')}</Text>
        </div>
        <Icon
          name="eye"
          tw="absolute top-2 right-2"
          className="openEntityIcon"
        />
      </RelatedEntityCard>
      <FunctionalButton onClick={handleCopyHash}>
        <Icon name="copy" />
        copy hash
      </FunctionalButton>
    </div>
  )
}

export const EntityLinkedVolumes = ({
  linkedVolumes,
  onImmutableVolumeClick: handleImmutableVolumeClick,
}: EntityLinkedVolumesProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        LINKED VOLUMES
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          {linkedVolumes.map(
            (volume) =>
              volume && (
                <LinkedVolumeItem
                  key={`linked-volume-${volume.id}`}
                  volume={volume}
                  onClick={() => handleImmutableVolumeClick(volume)}
                />
              ),
          )}
        </div>
      </NoisyContainer>
    </>
  )
}
EntityLinkedVolumes.displayName = 'EntityLinkedVolumes'

export default memo(EntityLinkedVolumes) as typeof EntityLinkedVolumes
