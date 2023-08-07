import AutoBreadcrumb from '@/components/common/AutoBreadcrumb'
import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import NoisyContainer from '@/components/common/NoisyContainer'
import { EntityTypeName, breadcrumbNames } from '@/helpers/constants'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/aleph-core'
import { useManageInstance } from '@/hooks/pages/dashboard/manage/useManageInstance'
import {
  convertBitUnits,
  ellipseAddress,
  ellipseText,
  humanReadableSize,
} from '@/helpers/utils'
import { Container, GrayText, Separator } from '../common'
import VolumeList from '../VolumeList'
import StatusLabel from '@/components/common/StatusLabel'
import { ThreeDots } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export default function ManageInstance() {
  const {
    instance,
    status,
    handleCopyHash,
    handleCopyConnect,
    handleDelete,
    copyAndNotify,
  } = useManageInstance()

  const theme = useTheme()

  if (!instance) {
    return (
      <>
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name =
    (instance?.metadata?.name as string) || ellipseAddress(instance.id)
  const typeName = EntityTypeName[instance.type]
  const volumes = instance.volumes

  return (
    <>
      <AutoBreadcrumb names={breadcrumbNames} name={name.toUpperCase()} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="alien-8bit" tw="mr-4" className="text-main1" />
              <div className="tp-body2">{name}</div>
              <StatusLabel
                variant={
                  instance.confirmed && status?.vm_ipv6
                    ? 'running'
                    : 'confirming'
                }
                tw="ml-4"
              />
            </div>
            <div>
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
                  {instance.id}
                </IconText>
              </div>
            </div>

            <Separator />

            <div tw="flex my-5">
              <div tw="mr-5">
                <div className="tp-info text-main0">CORES</div>
                <div>
                  <GrayText>{instance.resources.vcpus} x86 64bit</GrayText>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">RAM</div>
                <div>
                  <GrayText>
                    {convertBitUnits(instance.resources.memory, {
                      from: 'mb',
                      to: 'gb',
                      displayUnit: true,
                    })}
                  </GrayText>
                </div>
              </div>

              {status && (
                <div tw="mr-5">
                  <div className="tp-info text-main0">IPV6</div>
                  <div>
                    <GrayText>{status.vm_ipv6}</GrayText>
                  </div>
                </div>
              )}
            </div>

            <div tw="mr-5">
              <div className="tp-info text-main0">SSH COMMAND</div>
              <div>
                {status ? (
                  <IconText iconName="copy" onClick={handleCopyConnect}>
                    <GrayText>&gt;_ ssh root@{status.vm_ipv6}</GrayText>
                  </IconText>
                ) : (
                  <div tw="flex items-end">
                    <span tw="mr-1" className="tp-body1 fs-sm text-main2">
                      Allocating
                    </span>
                    <ThreeDots
                      width=".8rem"
                      height="1rem"
                      color={theme.color.main2}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div tw="my-5">
              <div className="tp-info text-main0">EXPLORER</div>
              <div>
                <a
                  className="tp-body1 fs-sm"
                  href={instance.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <GrayText>{ellipseText(instance.url, 80)}</GrayText>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="flex my-5">
              <div tw="mr-5">
                <div className="tp-info text-main0">SIZE</div>
                <div>
                  <GrayText className="fs-xs tp-body1">
                    {humanReadableSize(instance.size, 'mb')}
                  </GrayText>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <GrayText className="fs-xs tp-body1">
                    {instance.date}
                  </GrayText>
                </div>
              </div>
            </div>

            {status?.node && (
              <>
                <Separator />

                <TextGradient type="h6" color="main1">
                  Current CRN
                </TextGradient>

                <div tw="my-5">
                  <div className="tp-info text-main0">NAME</div>
                  <div>
                    <GrayText>{status.node.node_id}</GrayText>
                  </div>
                </div>

                <div tw="my-5">
                  <div className="tp-info text-main0">URL</div>
                  <div>
                    <a
                      className="tp-body1 fs-sm"
                      href={status.node.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <IconText iconName="square-up-right">
                        <GrayText>{ellipseText(status.node.url, 80)}</GrayText>
                      </IconText>
                    </a>
                  </div>
                </div>
              </>
            )}

            {volumes.length > 0 && (
              <>
                <Separator />

                <TextGradient type="h6" color="main1">
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
            <ButtonLink variant="primary" href="/dashboard/instance">
              Create new instance
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
