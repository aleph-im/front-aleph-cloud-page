import Link from 'next/link'
import {
  humanReadableSize,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import { MachineVolume } from '@aleph-sdk/message'
import React from 'react'
import { Text } from '../common'
import IconText from '@/components/common/IconText'

export type VolumeListProps = {
  volumes: MachineVolume[]
  copyAndNotify: (text: string) => void
}

export const VolumeList = React.memo(
  ({ volumes, copyAndNotify }: VolumeListProps) => {
    return (
      <>
        {volumes.map((volume, i) => (
          <div tw="my-5" key={i}>
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
                    <IconText iconName="square-up-right">
                      Volume details
                    </IconText>
                  </Link>
                </div>
                <div className="tp-info text-main0">ITEM HASH</div>
                <IconText
                  iconName="copy"
                  onClick={() => copyAndNotify(volume.ref)}
                >
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
        ))}
      </>
    )
  },
)
VolumeList.displayName = 'VolumeList'

export default VolumeList
