import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag } from '@aleph-front/core'
import { useManageVolume } from '@/hooks/pages/solutions/manage/useManageVolume'
import { ellipseAddress, ellipseText, humanReadableSize } from '@/helpers/utils'
import { Container, GrayText, Separator } from '../common'
import StatusLabel from '@/components/common/StatusLabel'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export default function ManageVolume() {
  const { volume, handleCopyHash, handleDelete, handleDownload } =
    useManageVolume()

  const theme = useTheme()

  if (!volume) {
    return (
      <>
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name = ellipseAddress(volume.id)
  const typeName = EntityTypeName[volume.type]

  return (
    <>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="floppy-disk" tw="mr-4" className="text-main1" />
              <div className="tp-body2">{name}</div>
              <StatusLabel
                variant={volume.confirmed ? 'success' : 'warning'}
                tw="ml-4"
              >
                {volume.confirmed ? (
                  'READY'
                ) : (
                  <div tw="flex items-center">
                    <div tw="mr-2">CONFIRMING</div>
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  </div>
                )}
              </StatusLabel>
            </div>
            <div>
              <Button
                size="regular"
                variant="tertiary"
                color="main0"
                kind="neon"
                tw="!mr-4"
                forwardedAs="a"
                onClick={handleDownload}
              >
                Download
              </Button>
              <Button
                size="regular"
                variant="tertiary"
                color="main2"
                kind="neon"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>

          <NoisyContainer>
            <div tw="flex items-center justify-start overflow-hidden">
              <Tag className="tp-body2 fs-16" tw="mr-4 whitespace-nowrap">
                {typeName}
              </Tag>
              <div tw="flex-auto">
                <div className="tp-info text-main0">ITEM HASH</div>
                <IconText iconName="copy" onClick={handleCopyHash}>
                  {volume.id}
                </IconText>
              </div>
            </div>

            <Separator />

            <div tw="my-5">
              <div className="tp-info text-main0">EXPLORER</div>
              <div>
                <a
                  className="tp-body1 fs-16"
                  href={volume.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <GrayText>{ellipseText(volume.url, 80)}</GrayText>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="flex my-5">
              <div tw="mr-5">
                <div className="tp-info text-main0">SIZE</div>
                <div>
                  <GrayText className="fs-10 tp-body1">
                    {humanReadableSize(volume.size, 'MiB')}
                  </GrayText>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <GrayText className="fs-10 tp-body1">{volume.date}</GrayText>
                </div>
              </div>
            </div>
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/storage/volume/new">
              Create new volume
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
