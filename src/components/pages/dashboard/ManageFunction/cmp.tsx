import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { Label, NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageFunction } from '@/hooks/pages/solutions/manage/useManageFunction'
import { ellipseAddress, ellipseText, humanReadableSize } from '@/helpers/utils'
import { Container, GrayText, Separator } from '../common'
import VolumeList from '../VolumeList'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export default function ManageFunction() {
  const { func, handleCopyHash, handleDelete, copyAndNotify } =
    useManageFunction()

  const theme = useTheme()

  if (!func) {
    return (
      <>
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name = func?.metadata?.name || ellipseAddress(func.id)
  const typeName = EntityTypeName[func.type]
  const volumes = func.volumes

  return (
    <>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="alien-8bit" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
                variant={func.confirmed ? 'success' : 'warning'}
                tw="ml-4"
              >
                {func.confirmed ? (
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
            <div>
              {/* <Button
                size="md"
                variant="tertiary"
                color="main0"
                kind="default"
                tw="!mr-4"
                forwardedAs="a"
                onClick={handleDownload}
              >
                Download
              </Button> */}
              <Button
                kind="functional"
                variant="warning"
                size="md"
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
                  {func.id}
                </IconText>
              </div>
            </div>

            <Separator />

            <div tw="my-5">
              <div className="tp-info text-main0">EXPLORER</div>
              <div>
                <a
                  className="tp-body1 fs-16"
                  href={func.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <GrayText>{ellipseText(func.url, 80)}</GrayText>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="my-5">
              <span className="tp-info text-main0">API ENTRYPOINT</span>
              <div>
                <a
                  className="tp-body1 fs-16"
                  href={func.urlVM}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <GrayText>{ellipseText(func.urlVM, 80)}</GrayText>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="flex my-5">
              <div tw="mr-5">
                <div className="tp-info text-main0">SIZE</div>
                <div>
                  <GrayText className="fs-10 tp-body1">
                    {humanReadableSize(func.size, 'MiB')}
                  </GrayText>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <GrayText className="fs-10 tp-body1">{func.date}</GrayText>
                </div>
              </div>
            </div>

            {volumes.length > 0 && (
              <>
                <Separator />

                <TextGradient type="body3" as="h7" color="main0">
                  Linked storage
                </TextGradient>

                <VolumeList
                  {...{
                    volumes,
                    copyAndNotify,
                  }}
                />
              </>
            )}
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/computing/function/new">
              Create new function
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
