import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { Label, NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageInstance } from '@/hooks/pages/solutions/manage/useManageInstance'
import { convertByteUnits, ellipseAddress, ellipseText } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import VolumeList from '../VolumeList'
import { RotatingLines, ThreeDots } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import Link from 'next/link'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function ManageInstance() {
  const {
    instance,
    status,
    mappedKeys,
    crn,
    nodeDetails,
    handleRetryAllocation,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
    handleBack,
  } = useManageInstance()

  const theme = useTheme()

  if (!instance) {
    return (
      <>
        <BackButtonSection handleBack={handleBack} />
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
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5 flex-wrap gap-4 flex-col md:flex-row">
            <div tw="flex items-center">
              <Icon name="alien-8bit" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
                variant={
                  instance.time < Date.now() - 1000 * 45 && status?.vm_ipv6
                    ? 'success'
                    : 'warning'
                }
                tw="ml-4"
              >
                {status?.vm_ipv6 ? (
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
            <div tw="flex gap-4 flex-col md:flex-row">
              {!status?.vm_ipv6 && crn && (
                <Button
                  kind="functional"
                  variant="warning"
                  size="md"
                  onClick={handleRetryAllocation}
                >
                  Reallocate
                </Button>
              )}
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
              <Tag variant="accent" tw="mr-4 whitespace-nowrap">
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
                  <Text>{instance.resources.vcpus} x86 64bit</Text>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">RAM</div>
                <div>
                  <Text>
                    {convertByteUnits(instance.resources.memory, {
                      from: 'MiB',
                      to: 'GiB',
                      displayUnit: true,
                    })}
                  </Text>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">HDD</div>
                <div>
                  <Text>
                    {convertByteUnits(instance.size, {
                      from: 'MiB',
                      to: 'GiB',
                      displayUnit: true,
                    })}
                  </Text>
                </div>
              </div>
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
                    <Text>{ellipseText(instance.url, 80)}</Text>
                  </IconText>
                </a>
              </div>
            </div>

            <Separator />

            <div tw="my-5">
              <TextGradient type="h7" as="h2" color="main0">
                Connection methods
              </TextGradient>

              <div tw="my-5">
                <div className="tp-info text-main0">SSH COMMAND</div>
                <div>
                  {status ? (
                    <IconText iconName="copy" onClick={handleCopyConnect}>
                      <Text>&gt;_ ssh root@{status.vm_ipv6}</Text>
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
                      <Text>{status.vm_ipv6}</Text>
                    </IconText>
                  )}
                </div>
              </div>
            </div>

            <div tw="my-5">
              <TextGradient type="h7" as="h2" color="main0">
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
                          href={`/settings/ssh/${key.id}`}
                        >
                          <IconText iconName="square-up-right">
                            <Text>{key.label}</Text>
                          </IconText>
                        </Link>
                      </div>
                    ),
                )}
              </div>
            </div>

            {nodeDetails && (
              <>
                <Separator />

                <TextGradient type="h7" as="h2" color="main0">
                  Current CRN
                </TextGradient>

                <div tw="my-5">
                  <div className="tp-info text-main0">NAME</div>
                  <div>
                    <Text>{nodeDetails.name}</Text>
                  </div>
                </div>

                <div tw="my-5">
                  <div className="tp-info text-main0">URL</div>
                  <div>
                    <a
                      className="tp-body1 fs-16"
                      href={nodeDetails.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <IconText iconName="square-up-right">
                        <Text>{ellipseText(nodeDetails.url, 80)}</Text>
                      </IconText>
                    </a>
                  </div>
                </div>
              </>
            )}

            {volumes.length > 0 && (
              <>
                <Separator />

                <TextGradient type="h7" as="h2" color="main0">
                  Linked Storage(s)
                </TextGradient>

                <VolumeList {...{ volumes }} />
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
