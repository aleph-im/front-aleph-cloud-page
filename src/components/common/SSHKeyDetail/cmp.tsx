import React, { memo } from 'react'
import { SSHKeyDetailProps } from './types'
import { Button, Icon, Label, NoisyContainer, Tag } from '@aleph-front/core'
import { RotatingLines } from 'react-loader-spinner'
import IconText from '../IconText'
import { Separator, Text } from '@/components/pages/dashboard/common'
import { ellipseAddress, ellipseText } from '@/helpers/utils'
import { useSSHKeyDetail } from './hook'
import { EntityTypeName } from '@/helpers/constants'

export const SSHKeyDetail = ({ sshKeyId }: SSHKeyDetailProps) => {
  const { sshKey, theme, handleCopyKey, handleCopyLabel, handleDelete } =
    useSSHKeyDetail({ sshKeyId })

  if (!sshKey) return <>NO SSH KEY</>

  const name = sshKey.label || ellipseAddress(sshKey.id)
  const typeName = EntityTypeName[sshKey.type]

  return (
    <>
      <div tw="flex justify-between pb-5">
        <div tw="flex items-center">
          <Icon name="key" tw="mr-4" className="text-main0" />
          <div className="tp-body2">{name}</div>
          <Label variant={sshKey.confirmed ? 'success' : 'warning'} tw="ml-4">
            {sshKey.confirmed ? (
              'READY'
            ) : (
              <div tw="flex items-center">
                <div tw="mr-2">CONFIRMING</div>
                <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
              </div>
            )}
          </Label>
        </div>
        <div>
          <Button
            kind="functional"
            variant="error"
            size="md"
            onClick={handleDelete}
          >
            <Icon name="trash" />
          </Button>
        </div>
      </div>

      <NoisyContainer>
        <div tw="flex items-center justify-start overflow-hidden">
          <Tag variant="accent" tw="mr-4 whitespace-nowrap">
            {typeName}
          </Tag>
          <div tw="flex-auto">
            <div className="tp-info text-main0">KEY</div>
            <IconText iconName="copy" onClick={handleCopyKey}>
              {sshKey.key}
            </IconText>
          </div>
        </div>

        <Separator />

        {sshKey.label && (
          <div tw="my-5">
            <div className="tp-info text-main0">LABEL</div>
            <div>
              <IconText iconName="copy" onClick={handleCopyLabel}>
                <Text>{sshKey.label}</Text>
              </IconText>
            </div>
          </div>
        )}

        <div tw="my-5">
          <div className="tp-info text-main0">EXPLORER</div>
          <div>
            <a
              className="tp-body1 fs-16"
              href={sshKey.url}
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <IconText iconName="square-up-right">
                <Text>{ellipseText(sshKey.url, 80)}</Text>
              </IconText>
            </a>
          </div>
        </div>

        <div tw="my-5">
          <div className="tp-info text-main0">CREATED ON</div>
          <div>
            <Text className="fs-10 tp-body1">{sshKey.date}</Text>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
SSHKeyDetail.displayName = 'SSHKeyDetail'

export default memo(SSHKeyDetail) as typeof SSHKeyDetail
