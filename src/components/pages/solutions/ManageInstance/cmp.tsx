import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageInstance } from '@/hooks/pages/solutions/manage/useManageInstance'
import { convertByteUnits, ellipseAddress, ellipseText } from '@/helpers/utils'
import { Container, GrayText, Separator } from '../common'
import VolumeList from '../VolumeList'
import StatusLabel from '@/components/common/StatusLabel'
import { RotatingLines, ThreeDots } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import Link from 'next/link'

export default function ManageInstance() {
  const {
    instance,
    status,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
    copyAndNotify,
    mappedKeys,
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
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="alien-8bit" tw="mr-4" className="text-main1" />
              <div className="tp-body2">{name}</div>
              <StatusLabel
                variant={
                  instance.confirmed && status?.vm_ipv6 ? 'success' : 'warning'
                }
                tw="ml-4"
              >
                {instance.confirmed && status?.vm_ipv6 ? (
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
                size="md"
                variant="tertiary"
                color="main2"
                kind="default"
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
                    {convertByteUnits(instance.resources.memory, {
                      from: 'MiB',
                      to: 'GiB',
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
              <div className="tp-info text-main0">EXPLORER</div>
              <div>
                <a
                  className="tp-body1 fs-16"
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

            <Separator />

            <div tw="my-5">
              <TextGradient type="h7" color="main1">
                Connection methods
              </TextGradient>

              <div tw="my-5">
                <div className="tp-info text-main0">SSH COMMAND</div>
                <div>
                  {status ? (
                    <IconText iconName="copy" onClick={handleCopyConnect}>
                      <GrayText>&gt;_ ssh root@{status.vm_ipv6}</GrayText>
                    </IconText>
                  ) : (
                    <div tw="flex items-end">
                      <span tw="mr-1" className="tp-body1 fs-16 text-main2">
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

              <div tw="my-5">
                <div className="tp-info text-main0">IPv6</div>
                <div>
                  {status && (
                    <IconText iconName="copy" onClick={handleCopyIpv6}>
                      <GrayText>{status.vm_ipv6}</GrayText>
                    </IconText>
                  )}
                </div>
              </div>
            </div>

            <div tw="my-5">
              <TextGradient type="h7" color="main1">
                Accessible for
              </TextGradient>

              <div tw="my-5 flex">
                {mappedKeys.map(
                  (key, i) =>
                    key && (
                      <div key={key?.id} tw="mr-5">
                        <div className="tp-info text-main0">
                          SSH KEY #{i + 1}
                        </div>

                        <Link
                          className="tp-body1 fs-16"
                          href={'?hash=' + key.id}
                          referrerPolicy="no-referrer"
                        >
                          <IconText iconName="square-up-right">
                            <GrayText>{key.label}</GrayText>
                          </IconText>
                        </Link>
                      </div>
                    ),
                )}
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
                      className="tp-body1 fs-16"
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
            <ButtonLink variant="primary" href="/computing/instance/new">
              Create new instance
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
