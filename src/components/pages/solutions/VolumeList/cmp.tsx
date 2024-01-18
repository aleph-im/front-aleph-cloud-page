import Link from 'next/link'
import {
  humanReadableSize,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import { MachineVolume } from 'aleph-sdk-ts/dist/messages/types'
import React from 'react'
import { GrayText } from '../common'
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
                <div>
                  <GrayText className="fs-10 tp-body1">
                    {humanReadableSize(volume.size_mib, 'MiB')}
                  </GrayText>
                </div>
              </div>
            ) : isVolumeEphemeral(volume) ? (
              <div tw="my-5">
                <div className="tp-info text-main0">EPHEMERAL VOLUME</div>
                <div>
                  <GrayText className="fs-10 tp-body1">
                    {humanReadableSize(volume.size_mib, 'MiB')}
                  </GrayText>
                </div>
              </div>
            ) : (
              <div>
                <div className="tp-info text-main0">IMMUTABLE VOLUME</div>
                <div>
                  <Link
                    className="tp-body1 fs-16"
                    href={`/storage/volume/${volume.ref}`}
                  >
                    <IconText iconName="square-up-right">
                      Volume details
                    </IconText>
                  </Link>
                </div>
                <IconText
                  iconName="copy"
                  onClick={() => copyAndNotify(volume.ref)}
                >
                  {volume.ref}
                </IconText>
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
