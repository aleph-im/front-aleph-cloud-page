import Link from 'next/link'
import {
  humanReadableSize,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import { MachineVolume } from '@aleph-sdk/message'
import React, { memo } from 'react'
import { Text } from '../common'
import IconText from '@/components/common/IconText'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'

export type VolumeItemProps = {
  volume: MachineVolume
}

export const VolumeItem = ({ volume }: VolumeItemProps) => {
  const handleCopyRef = useCopyToClipboardAndNotify((volume as any)?.ref || '')

  return (
    <div tw="my-5">
      {isVolumePersistent(volume) ? (
        <div tw="my-5">
          <div className="tp-info text-main0">PERSISTENT VOLUME</div>
          <Text className="fs-10 tp-body1">
            {humanReadableSize(volume.size_mib, 'MiB')}
          </Text>
        </div>
      ) : isVolumeEphemeral(volume) ? (
        <div tw="my-5">
          <div className="tp-info text-main0">EPHEMERAL VOLUME</div>
          <Text className="fs-10 tp-body1">
            {humanReadableSize(volume.size_mib, 'MiB')}
          </Text>
        </div>
      ) : (
        <div tw="my-5">
          <div tw="mb-5">
            <div className="tp-info text-main0">IMMUTABLE VOLUME</div>
            <Link
              className="tp-body1 fs-16"
              href={`/storage/volume/${volume.ref}`}
            >
              <IconText iconName="square-up-right">Volume details</IconText>
            </Link>
          </div>
          <div className="tp-info text-main0">ITEM HASH</div>
          <IconText iconName="copy" onClick={handleCopyRef}>
            {volume.ref}
          </IconText>
          {volume.mount && (
            <div tw="mt-5">
              <div className="tp-info text-main0">MOUNT</div>
              <Text>{volume.mount}</Text>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
VolumeItem.displayName = 'VolumeItem'

// ---------------------------

export type VolumeListProps = {
  volumes: MachineVolume[]
}

export const VolumeList = ({ volumes }: VolumeListProps) => {
  return (
    <>
      {volumes.map((volume, i) => (
        <VolumeItemMemo key={i} {...{ volume }} />
      ))}
    </>
  )
}
VolumeList.displayName = 'VolumeList'

export const VolumeItemMemo = memo(VolumeItem)
export default memo(VolumeList)
