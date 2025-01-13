import Link from 'next/link'
import { RotatingLines } from 'react-loader-spinner'
import IconText from '@/components/common/IconText'
import {
  Label,
  NoisyContainer,
  ObjectImg,
  Tabs,
  Tooltip,
} from '@aleph-front/core'
import { Button, Icon } from '@aleph-front/core'
import { useManageInstance } from '@/hooks/pages/solutions/manage/useManageInstance'
import {
  convertByteUnits,
  ellipseAddress,
  ellipseText,
  humanReadableSize,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import { Container, Text } from '../common'
import BackButtonSection from '@/components/common/BackButtonSection'
import LogsFeed from '../LogsFeed'
import BackButton from '@/components/common/BackButton'
import { useEffect, useMemo, useState } from 'react'
import { ImmutableVolume } from '@aleph-sdk/message'
import { useAppState } from '@/contexts/appState'
import { Skeleton } from '@/components/common/Skeleton/cmp'
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

  const labelVariant = useMemo(() => {
    if (!instance) return 'error'

    return instance.time < Date.now() - 1000 * 45 && isRunning
      ? 'success'
      : 'warning'
  }, [instance, isRunning])

  const volumes = useMemo(() => {
    if (!instance) return []

    return instance.volumes
  }, [instance])

  const persistentVolumes = useMemo(() => {
    if (!volumes) return []

    return volumes.filter((volume) => isVolumePersistent(volume))
  }, [volumes])

  // const ephemeralVolumes = useMemo(() => {
  //   if (!volumes) return []

  //   return volumes.filter((volume) => isVolumeEphemeral(volume))
  // }, [volumes])

  const [immutableVolumes, setImmutableVolumes] = useState<any[]>([])

  const [state] = useAppState()
  const {
    manager: { volumeManager },
  } = state

  useEffect(() => {
    if (!volumes) return

    const buildVolumes = async () => {
      const rawVolumes = volumes.filter(
        (volume) => !isVolumePersistent(volume) && !isVolumeEphemeral(volume),
      ) as ImmutableVolume[]

      const decoratedVolumes = await Promise.all(
        rawVolumes.map(async (rawVolume) => {
          const extraInfo = await volumeManager?.get(rawVolume.ref)

          return {
            ...rawVolume,
            ...extraInfo,
          }
        }),
      )

      setImmutableVolumes(decoratedVolumes)
    }

    buildVolumes()
  }, [volumes, volumeManager])

  // const handleCopyVolumeHash = (hash: string) => {

  // immutableVolumes.forEach((volume) => {
  //   if (!volumeManager) return

  //   volumeManager.get(volume.ref).then((v) => {
  //     console.log('fetched volume', v)
  //     console.log('mount path', v?.mountPath)
  //   })
  // })

  const name = useMemo(() => {
    if (!instance) return ''

    return (instance?.metadata?.name as string) || ellipseAddress(instance.id)
  }, [instance])

  console.log('instance', instance)

  return (
    <>
      {/* Header */}
      <section tw="px-12 py-0! md:pt-10! pb-6">
        <div tw=" px-0 py-0! md:pt-10! flex items-center justify-between gap-8">
          <div tw="flex-1">
            <BackButton handleBack={handleBack} />
          </div>
          <div tw="flex gap-2 items-center justify-center">
            <Label kind="secondary" variant={labelVariant}>
              <div tw="flex items-center justify-center gap-2">
                <Icon name="alien-8bit" className={`text-${labelVariant}`} />
                {isRunning ? (
                  'RUNNING'
                ) : (
                  <>
                    <div>CONFIRMING</div>
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  </>
                )}
              </div>
            </Label>
            <div className="tp-h7 fs-18" tw="uppercase">
              {instance ? name : <Skeleton width="20rem" />}
            </div>
          </div>
          <div tw="flex-1 flex flex-wrap md:flex-nowrap justify-end items-center gap-4">
            <Tooltip content="Stop Instance" my="bottom-center" at="top-center">
              <Button
                kind="functional"
                variant="secondary"
                size="sm"
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
                kind="functional"
                variant="secondary"
                size="sm"
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
                kind="functional"
                variant="secondary"
                size="sm"
                onClick={handleReboot}
                disabled={rebootDisabled}
              >
                <Icon name="arrow-rotate-backward" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Remove Instance"
              my="bottom-center"
              at="top-center"
            >
              <Button
                kind="functional"
                variant="error"
                size="sm"
                onClick={handleDelete}
                disabled={!instance}
              >
                <Icon name="trash" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </section>
      {/* Instance properties */}
      <div tw="flex flex-wrap gap-x-24 gap-y-9 px-12 py-6">
        <div tw="flex-1 w-1/2 min-w-[32rem] flex flex-col gap-y-9">
          <div>
            <div className="tp-h7 fs-18" tw="uppercase mb-2">
              INSTANCE DETAILS
            </div>
            <NoisyContainer>
              <div tw="flex gap-4">
                <ObjectImg
                  id="Object11"
                  color="main0"
                  size="6rem"
                  tw="min-w-[7rem] min-h-[7rem]"
                />
                <div tw="flex flex-col gap-4 w-full">
                  <div tw="w-full">
                    <div className="tp-info text-main0 fs-12">ITEM HASH</div>
                    {instance ? (
                      <IconText iconName="copy" onClick={handleCopyHash}>
                        {instance.id}
                      </IconText>
                    ) : (
                      <Skeleton width="100%" />
                    )}
                  </div>
                  <div tw="flex flex-wrap gap-4">
                    <div>
                      <div className="tp-info text-main0 fs-12">CORES</div>
                      <div>
                        <Text tw="flex items-center gap-1">
                          {instance ? (
                            `${instance.resources.vcpus} x86 64bit`
                          ) : (
                            <Skeleton width="7rem" />
                          )}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <div className="tp-info text-main0 fs-12">RAM</div>
                      <div>
                        <Text>
                          {instance ? (
                            convertByteUnits(instance.resources.memory, {
                              from: 'MiB',
                              to: 'GiB',
                              displayUnit: true,
                            })
                          ) : (
                            <Skeleton width="4rem" />
                          )}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <div className="tp-info text-main0 fs-12">HDD</div>
                      <div>
                        <Text>
                          {instance ? (
                            convertByteUnits(instance.size, {
                              from: 'MiB',
                              to: 'GiB',
                              displayUnit: true,
                            })
                          ) : (
                            <Skeleton width="6rem" />
                          )}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="tp-info text-main0 fs-12">EXPLORER</div>
                    <div>
                      {instance ? (
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
                      ) : (
                        <Skeleton width="20rem" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </NoisyContainer>
          </div>
          <div>
            <div className="tp-h7 fs-18" tw="uppercase mb-2">
              LOGS
            </div>
            <NoisyContainer>
              <div tw="flex flex-col gap-4">
                <div>
                  <div className="tp-info text-main0 fs-12">INFO</div>
                  <Text>
                    Real-time logs of the of the virtual machine. Use this to
                    debug any issue with the boot of your instance and to
                    monitor the behavior of the your instance while it is
                    running.
                  </Text>
                </div>
                <div tw="flex flex-wrap gap-6">
                  <Button
                    variant="functional"
                    size="sm"
                    onClick={() => {
                      alert('TODO: add view logs')
                    }}
                    className="bg-purple0 text-main0"
                    tw="px-6 py-2 rounded-full flex items-center justify-center gap-x-3 font-bold"
                    disabled={!instance}
                  >
                    <Icon name="eye" />
                    [WIP] view
                  </Button>
                  <Button
                    variant="functional"
                    size="sm"
                    onClick={() => {
                      alert('TODO: add download logs')
                    }}
                    className="bg-purple0 text-main0"
                    tw="px-6 py-2 rounded-full flex items-center justify-center gap-x-3 font-bold"
                    disabled={!instance}
                  >
                    <Icon name="download" />
                    [WIP] download logs
                  </Button>
                </div>
              </div>
            </NoisyContainer>
          </div>
          <div>
            <div className="tp-h7 fs-18" tw="uppercase mb-2">
              SSH KEYS
            </div>
            <NoisyContainer>
              <div tw="flex flex-col gap-4">
                {mappedKeys.length ? (
                  mappedKeys.map(
                    (key) =>
                      key && (
                        <div key={key?.id} tw="flex items-center gap-6">
                          <ObjectImg
                            id="Object9"
                            color="main0"
                            size="2.5rem"
                            tw="min-w-[3rem] min-h-[3rem]"
                          />
                          <div>
                            <div className="tp-info text-main0 fs-12">
                              SSH KEY NAME
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
                          <div>
                            <div className="tp-info text-main0 fs-12">
                              CREATED ON
                            </div>
                            <Text>{key.date}</Text>
                          </div>
                        </div>
                      ),
                  )
                ) : (
                  <div tw="flex items-center gap-6">
                    <ObjectImg
                      id="Object9"
                      color="main0"
                      size="2.5rem"
                      tw="min-w-[3rem] min-h-[3rem]"
                    />
                    <div>
                      <div className="tp-info text-main0 fs-12">
                        SSH KEY NAME
                      </div>
                      <Text>
                        <Skeleton width="9rem" />
                      </Text>
                    </div>
                    <div>
                      <div className="tp-info text-main0 fs-12">CREATED ON</div>
                      <Text>
                        <Skeleton width="14rem" />
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </NoisyContainer>
          </div>
          {/* <div>
            <div className="tp-h7 fs-18" tw="uppercase mb-2">
              PAYMENT
            </div>
            <NoisyContainer>
              <div tw="flex">
                <div
                  className="bg-main0 text-base0"
                  tw="flex items-center gap-1 px-3 py-1"
                >
                  <Logo img="aleph" color="base0" byAleph={false} />
                  <div tw="uppercase font-bold leading-relaxed">ALEPH</div>
                </div>
              </div>
            </NoisyContainer>
          </div> */}
        </div>
        <div tw="flex-1 w-1/2 min-w-[20rem] flex flex-col gap-y-9">
          <div>
            <div className="tp-h7 fs-18" tw="uppercase mb-2">
              HOSTING CRN
            </div>
            <NoisyContainer>
              <div tw="flex flex-col gap-4">
                <div tw="flex gap-4">
                  <div>
                    <div className="tp-info text-main0 fs-12">NAME</div>
                    <div>
                      <Text>
                        {nodeDetails ? (
                          nodeDetails.name
                        ) : (
                          <Skeleton width="7rem" />
                        )}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <div className="tp-info text-main0 fs-12">URL</div>
                    <div>
                      {nodeDetails ? (
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
                      ) : (
                        <Skeleton width="12rem" />
                      )}
                    </div>
                  </div>
                </div>
                {termsAndConditions && (
                  <div>
                    <div className="tp-info text-main0 fs-12">ACCEPTED T&C</div>
                    <div>
                      <a
                        className="tp-body1 fs-16"
                        href={`https://ipfs.aleph.im/ipfs/${termsAndConditions.cid}?filename=${termsAndConditions.name}`}
                        target="_blank"
                        referrerPolicy="no-referrer"
                      >
                        <IconText iconName="square-up-right">
                          <Text>{termsAndConditions.name}</Text>
                        </IconText>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </NoisyContainer>
          </div>
          <div>
            <div className="tp-h7 fs-18" tw="uppercase mb-2">
              CONNECTION METHODS
            </div>
            <NoisyContainer>
              <div tw="flex flex-col gap-4">
                <div>
                  <div className="tp-info text-main0 fs-12">SSH COMMAND</div>
                  <div>
                    {status ? (
                      <IconText iconName="copy" onClick={handleCopyConnect}>
                        <Text>&gt;_ ssh root@{status.ipv6Parsed}</Text>
                      </IconText>
                    ) : (
                      <Skeleton width="20rem" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="tp-info text-main0 fs-12">IPV6</div>
                  <div>
                    {status ? (
                      <IconText iconName="copy" onClick={handleCopyIpv6}>
                        <Text>{status.ipv6Parsed}</Text>
                      </IconText>
                    ) : (
                      <Skeleton width="10rem" />
                    )}
                  </div>
                </div>
              </div>
            </NoisyContainer>
          </div>
          {immutableVolumes.length > 0 && (
            <div>
              <div className="tp-h7 fs-18" tw="uppercase mb-2">
                LINKED VOLUMES
              </div>
              <NoisyContainer>
                <div tw="flex flex-col gap-4">
                  {immutableVolumes.map(
                    (volume, i) =>
                      volume && (
                        <div
                          key={`linked-volume-${i}`}
                          tw="flex items-center gap-6 min-w-fit"
                        >
                          <div
                            tw="p-3 flex items-center gap-2"
                            className="bg-base1"
                          >
                            <ObjectImg
                              id="Object16"
                              color="base2"
                              size="2.5rem"
                              tw="min-w-[3rem] min-h-[3rem]"
                            />
                            <div>
                              <div className="tp-info">{volume.mount}</div>
                              <Text className="fs-12">
                                {humanReadableSize(volume.size, 'MiB')}
                              </Text>
                            </div>
                          </div>
                          <div tw="flex flex-wrap gap-6">
                            <Button
                              variant="functional"
                              size="sm"
                              onClick={() => {
                                alert('TODO: add copy hash logic')
                              }}
                              className="bg-purple0 text-main0"
                              tw="px-6 py-2 rounded-full flex items-center justify-center gap-x-3 font-bold"
                            >
                              <Icon name="copy" />
                              [WIP] copy hash
                            </Button>
                            <Button
                              variant="functional"
                              size="sm"
                              onClick={() => {
                                alert('TODO: add edit link')
                              }}
                              className="bg-purple0 text-main0"
                              tw="px-6 py-2 rounded-full flex items-center justify-center gap-x-3 font-bold"
                            >
                              <Icon name="edit" />
                              [WIP] edit
                            </Button>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </NoisyContainer>
            </div>
          )}
          {persistentVolumes.length > 0 && (
            <div>
              <div className="tp-h7 fs-18" tw="uppercase mb-2">
                PERSISTENT STORAGE
              </div>
              <NoisyContainer>
                <div tw="flex gap-4">
                  <ObjectImg
                    id="Object16"
                    color="main0"
                    size="3rem"
                    tw="min-w-[4rem] min-h-[4rem]"
                  />
                  <div tw="flex flex-wrap gap-4">
                    {persistentVolumes.map(
                      (volume, i) =>
                        volume && (
                          <div key={`persistent-volume-${i}`}>
                            <div
                              tw="p-3 flex flex-col gap-1"
                              className="bg-base1"
                            >
                              <div className="tp-info">{volume.name}</div>
                              <div tw="flex justify-between items-center gap-4">
                                <Text className="fs-12">
                                  {humanReadableSize(volume.size_mib, 'MiB')}
                                </Text>
                                <Button
                                  variant="functional"
                                  size="sm"
                                  onClick={() => {
                                    alert('TODO: add edit link')
                                  }}
                                  className="text-main0"
                                >
                                  <Icon name="edit" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              </NoisyContainer>
            </div>
          )}
          {streamDetails && (
            <>
              <Separator />

              <TextGradient type="h7" as="h2" color="main0">
                Active streams
              </TextGradient>

              {!streamDetails.streams.length ? (
                <div tw="my-5">There are no active streams</div>
              ) : (
                <div tw="my-5">
                  {streamDetails.streams.length} active streams in{' '}
                  <strong className="text-main0">
                    {blockchains[streamDetails.blockchain].name}
                  </strong>{' '}
                  network
                </div>
              )}

              {streamDetails.streams.map((stream) => (
                <div key={`${stream.sender}:${stream.receiver}`} tw="my-5">
                  <StreamSummary {...stream} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <NoisyContainer>
            <Tabs
              selected={tabId}
              align="left"
              onTabChange={setTabId}
              tabs={tabs}
            />

            <div role="tabpanel" tw="mt-6">
              {tabId === 'detail' ? (
                <></>
              ) : tabId === 'log' ? (
                <>
                  <LogsFeed logs={logs} />
                </>
              ) : (
                <></>
              )}
            </div>
          </NoisyContainer>
        </Container>
      </section>
    </>
  )
}
