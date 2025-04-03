import React, { memo } from 'react'
import { VolumeDetailProps } from './types'
import { Button, Icon, Label, NoisyContainer, Tag } from '@aleph-front/core'
import { RotatingLines } from 'react-loader-spinner'
import IconText from '../IconText'
import { Separator, Text } from '@/components/pages/console/dashboard/common'
import { ellipseAddress, ellipseText, humanReadableSize } from '@/helpers/utils'
import { useVolumeDetail } from './hook'
import { EntityTypeName } from '@/helpers/constants'
import Skeleton from '../Skeleton'

export const VolumeDetail = ({
  volumeId,
  showDelete = false,
}: VolumeDetailProps) => {
  const { volume, theme, handleDelete, handleCopyHash, handleDownload } =
    useVolumeDetail({ volumeId })

  return (
    <>
      <div tw="flex justify-between pb-5">
        <div tw="flex items-center">
          <Icon name="floppy-disk" tw="mr-4" className="text-main0" />
          <div className="tp-body2">
            {volume ? ellipseAddress(volume.id) : <Skeleton width="10rem" />}
          </div>
          <Label
            kind="secondary"
            variant={volume?.confirmed ? 'success' : 'warning'}
            tw="ml-4"
          >
            {!volume ? (
              'LOADING'
            ) : volume.confirmed ? (
              'READY'
            ) : (
              <div tw="flex items-center">
                <div tw="mr-2">CONFIRMING</div>
                <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
              </div>
            )}
          </Label>
        </div>
        <div tw="flex flex-wrap justify-end gap-2 sm:gap-4">
          <Button
            size="md"
            variant="tertiary"
            color="main0"
            kind="default"
            forwardedAs="a"
            onClick={handleDownload}
          >
            <Icon name="download" />
          </Button>
          {showDelete && (
            <Button
              kind="functional"
              variant="error"
              size="md"
              onClick={handleDelete}
            >
              <Icon name="trash" />
            </Button>
          )}
        </div>
      </div>

      <NoisyContainer>
        <div tw="flex items-center justify-start overflow-hidden">
          <Tag variant="accent" tw="mr-4 whitespace-nowrap">
            {volume ? (
              EntityTypeName[volume.type]
            ) : (
              <Skeleton width="5rem" height="1.3em" />
            )}
          </Tag>
          <div tw="flex-auto">
            <div className="tp-info text-main0">ITEM HASH</div>
            <IconText iconName="copy" onClick={handleCopyHash}>
              {volume ? volume.id : <Skeleton width="12rem" />}
            </IconText>
          </div>
        </div>

        <Separator />

        <div tw="my-5">
          <div className="tp-info text-main0">EXPLORER</div>
          <div>
            {volume ? (
              <a
                className="tp-body1 fs-16"
                href={volume.url}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <IconText iconName="square-up-right">
                  <Text>{ellipseText(volume.url, 80)}</Text>
                </IconText>
              </a>
            ) : (
              <Skeleton width="10rem" />
            )}
          </div>
        </div>

        <div tw="flex my-5">
          <div tw="mr-5">
            <div className="tp-info text-main0">SIZE</div>
            <div>
              <Text className="fs-10 tp-body1">
                {volume ? (
                  humanReadableSize(volume.size, 'MiB')
                ) : (
                  <Skeleton width="2rem" />
                )}
              </Text>
            </div>
          </div>

          <div tw="mr-5">
            <div className="tp-info text-main0">CREATED ON</div>
            <div>
              <Text className="fs-10 tp-body1">
                {volume ? volume.date : <Skeleton width="5rem" />}
              </Text>
            </div>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
VolumeDetail.displayName = 'VolumeDetail'

export default memo(VolumeDetail) as typeof VolumeDetail
