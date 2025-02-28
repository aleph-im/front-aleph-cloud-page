import Link from 'next/link'
import { RotatingLines, ThreeDots } from 'react-loader-spinner'
import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { Label, NoisyContainer, Tabs, Tooltip } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageInstance } from '@/hooks/pages/solutions/manage/useManageInstance'
import { convertByteUnits, ellipseAddress, ellipseText } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import VolumeList from '../VolumeList'
import BackButtonSection from '@/components/common/BackButtonSection'
import LogsFeed from '../LogsFeed'
import StreamSummary from '@/components/common/StreamSummary'
import { blockchains } from '@/domain/connect/base'

export default function ManageInstance() {
  const {
    instance,
    termsAndConditions,
    status,
    mappedKeys,
    nodeDetails,
    streamDetails,
    blockchain,
    isRunning,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    logs,
    tabs,
    tabId,
    theme,
    handleStop,
    handleStart,
    handleReboot,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
    handleBack,
    setTabId,
  } = useManageInstance()

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
                  instance.time < Date.now() - 1000 * 45 && isRunning
                    ? 'success'
                    : 'warning'
                }
                tw="ml-4"
              >
                {isRunning ? (
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
            <div tw="flex gap-4">
              <Tooltip
                content="Stop Instance"
                my="bottom-center"
                at="top-center"
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleStop}
                  disabled={stopDisabled}
                >
                  <Icon name="stop" />
                </Button>
              </Tooltip>
              <Tooltip
                content="Reallocate Instance"
                my="bottom-center"
                at="top-center"
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleStart}
                  disabled={startDisabled}
                >
                  <Icon name="play" />
                </Button>
              </Tooltip>

              <Tooltip
                content="Reboot Instance"
                my="bottom-center"
                at="top-center"
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleReboot}
                  disabled={rebootDisabled}
                >
                  <Icon name="arrow-rotate-backward" />
                </Button>
              </Tooltip>
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
                  {instance.id}
                </IconText>
              </div>
            </div>

            <Separator />

            <div tw="flex flex-wrap justify-start gap-5 my-5">
              <div>
                <div className="tp-info text-main0">CORES</div>
                <div>
                  <Text>{instance.resources.vcpus} x86 64bit</Text>
                </div>
              </div>

              <div>
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

              <div>
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

            <div tw="my-5">
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

            <Tabs
              selected={tabId}
              align="left"
              onTabChange={setTabId}
              tabs={tabs}
            />

            <div role="tabpanel" tw="mt-6">
              {tabId === 'detail' ? (
                <>
                  <div tw="my-5">
                    <TextGradient type="h7" as="h2" color="main0">
                      Connection methods
                    </TextGradient>

                    <div tw="my-5">
                      <div className="tp-info text-main0">SSH COMMAND</div>
                      <div>
                        {status ? (
                          <IconText iconName="copy" onClick={handleCopyConnect}>
                            <Text>&gt;_ ssh root@{status.ipv6Parsed}</Text>
                          </IconText>
                        ) : (
                          <div tw="flex items-end">
                            <span
                              tw="mr-1"
                              className="tp-body1 fs-16 text-main2"
                            >
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
                            <Text>{status.ipv6Parsed}</Text>
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
                                href={'?hash=' + key.id}
                                referrerPolicy="no-referrer"
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

                  {streamDetails && (
                    <>
                      <Separator />

                      <TextGradient type="h7" as="h2" color="main0">
                        Active streams
                      </TextGradient>

                      {streamDetails.blockchain !== blockchain ? (
                        <div tw="my-5">
                          Connect to{' '}
                          <strong className="text-main0">
                            {blockchains[streamDetails.blockchain].name}
                          </strong>{' '}
                          network to see the active streams
                        </div>
                      ) : (
                        !streamDetails.streams.length && (
                          <div tw="my-5">There are no active streams</div>
                        )
                      )}

                      {streamDetails.streams.map((stream) => (
                        <div
                          key={`${stream.sender}:${stream.receiver}`}
                          tw="my-5"
                        >
                          <StreamSummary {...stream} />
                        </div>
                      ))}
                    </>
                  )}

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

                  {termsAndConditions !== undefined && (
                    <>
                      <Separator />
                      <TextGradient type="h7" as="h2" color="main0">
                        Terms & Conditions
                      </TextGradient>
                      <div tw="my-5">
                        <div className="tp-info text-main0">ACCEPTED T&C</div>
                        <div>
                          <a
                            className="tp-body1 fs-16"
                            href={termsAndConditions.url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                          >
                            <IconText iconName="square-up-right">
                              <Text>{termsAndConditions.name}</Text>
                            </IconText>
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : tabId === 'log' ? (
                <>
                  <LogsFeed logs={logs} />
                </>
              ) : (
                <></>
              )}
            </div>
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
