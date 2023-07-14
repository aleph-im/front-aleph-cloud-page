import AutoBreadcrumb from '@/components/common/AutoBreadcrumb'
import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import NoisyContainer from '@/components/common/NoisyContainer'
import { EntityTypeName, breadcrumbNames } from '@/helpers/constants'
import { Button, Icon, Tag } from '@aleph-front/aleph-core'
import { useManageVolume } from '@/hooks/pages/dashboard/manage/useManageVolume'
import { ellipseAddress, ellipseText, humanReadableSize } from '@/helpers/utils'
import { Container, GrayText, Separator } from '../common'
import StatusLabel from '@/components/common/StatusLabel'

export default function ManageVolume() {
  const { volume, handleCopyHash, handleDelete, handleDownload } =
    useManageVolume()

  if (!volume) {
    return (
      <>
        <Container>
          <NoisyContainer>Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name = ellipseAddress(volume.id)
  const typeName = EntityTypeName[volume.type]

  return (
    <>
      <AutoBreadcrumb names={breadcrumbNames} name={name.toUpperCase()} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="floppy-disk" tw="mr-4" className="text-main1" />
              <div className="tp-body2">{name}</div>
              <StatusLabel
                variant={volume.confirmed ? 'ready' : 'confirming'}
                tw="ml-4"
              />
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
              <Tag className="tp-body2 fs-sm" tw="mr-4 whitespace-nowrap">
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
                  className="tp-body1 fs-sm"
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
                  <GrayText className="fs-xs tp-body1">
                    {humanReadableSize(volume.size, 'mb')}
                  </GrayText>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <GrayText className="fs-xs tp-body1">{volume.date}</GrayText>
                </div>
              </div>
            </div>
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/dashboard/volume">
              Create new volume
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
