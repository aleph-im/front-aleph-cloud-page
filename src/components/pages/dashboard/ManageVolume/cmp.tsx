import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { Label, NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag } from '@aleph-front/core'
import { useManageVolume } from '@/hooks/pages/solutions/manage/useManageVolume'
import { ellipseAddress, ellipseText, humanReadableSize } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function ManageVolume() {
  const { volume, handleCopyHash, handleDelete, handleDownload, handleBack } =
    useManageVolume()

  const theme = useTheme()

  if (!volume) {
    return (
      <>
        <BackButtonSection handleBack={handleBack} />
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
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="floppy-disk" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
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
                Download
              </Button>
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
                    <Text>{ellipseText(volume.url, 80)}</Text>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="flex my-5">
              <div tw="mr-5">
                <div className="tp-info text-main0">SIZE</div>
                <div>
                  <Text className="fs-10 tp-body1">
                    {humanReadableSize(volume.size, 'MiB')}
                  </Text>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <Text className="fs-10 tp-body1">{volume.date}</Text>
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
