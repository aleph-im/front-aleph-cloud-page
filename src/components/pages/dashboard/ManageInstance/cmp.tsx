import { RotatingLines } from 'react-loader-spinner'
import {
  ButtonProps,
  Label,
  Logo,
  NoisyContainer,
  Tooltip,
} from '@aleph-front/core'
import { Button, Icon } from '@aleph-front/core'
import { useManageInstance } from '@/hooks/pages/solutions/manage/useManageInstance'
import {
  ellipseAddress,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import { Text } from '../common'
import LogsFeed from '../LogsFeed'
import BackButton from '@/components/common/BackButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ImmutableVolume } from '@aleph-sdk/message'
import { useAppState } from '@/contexts/appState'
import { Skeleton } from '@/components/common/Skeleton/cmp'
import { StyledSliderContent } from './styles'
import { SidePanel } from '@/components/common/SidePanel/cmp'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
import { SSHKey } from '@/domain/ssh'
import VolumeDetail from '@/components/common/VolumeDetail'
import EntitySSHKeys from '@/components/common/entityData/EntitySSHKeys'
import EntityHostingCRN from '@/components/common/entityData/EntityHostingCRN'
import EntityConnectionMethods from '@/components/common/entityData/EntityConnectionMethods'
import EntityLinkedVolumes from '@/components/common/entityData/EntityLinkedVolumes'
import EntityPersistentStorage from '@/components/common/entityData/EntityPersistentStorage'
import InstanceDetails from '@/components/common/entityData/InstanceDetails'
import StreamSummary from '@/components/common/StreamSummary'
import { blockchains } from '@/domain/connect/base'

export function FunctionalButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="functional"
      size="sm"
      className="bg-purple0 text-main0"
      tw="px-6 py-2 rounded-full flex items-center justify-center leading-none gap-x-3 font-bold"
      {...props}
    >
      {children}
    </Button>
  )
}

export default function ManageInstance() {
  const {
    instance,
    status,
    mappedKeys,
    nodeDetails,
    streamDetails,
    isRunning,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    logs,
    tabId,
    theme,
    handleStop,
    handleStart,
    handleReboot,
    handleDelete,
    handleBack,
    setTabId,
  } = useManageInstance()

  const labelVariant = useMemo(() => {
    if (!instance) return 'warning'

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
    manager: { volumeManager, instanceManager },
  } = state

  useEffect(() => {
    if (!volumes) return
    if (!volumeManager) return

    const buildVolumes = async () => {
      const rawVolumes = volumes.filter(
        (volume) => !isVolumePersistent(volume) && !isVolumeEphemeral(volume),
      ) as ImmutableVolume[]

      const decoratedVolumes = await Promise.all(
        rawVolumes.map(async (rawVolume) => {
          const extraInfo = await volumeManager.get(rawVolume.ref)

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

  const name = useMemo(() => {
    if (!instance) return ''

    return (instance?.metadata?.name as string) || ellipseAddress(instance.id)
  }, [instance])

  const [cost, setCost] = useState<number>()

  useEffect(() => {
    const fetchCost = async () => {
      if (!instance?.payment) return

      const fetchedCost = await instanceManager?.getTotalCostByHash(
        instance.payment.type,
        instance.id,
      )

      setCost(fetchedCost)
    }

    fetchCost()
  }, [instance, instanceManager])

  const [openSidePanel, setOpenSidePanel] = useState(false)
  const [selectedVolume, setSelectedVolume] = useState<any | undefined>()
  const [selectedSSHKey, setSelectedSSHKey] = useState<SSHKey | undefined>()
  const [sidePanelContentType, setSidePanelContentType] = useState<
    'sshKey' | 'volume'
  >()

  const handleImmutableVolumeClick = useCallback((volume: any) => {
    setSidePanelContentType('volume')
    setSelectedVolume(volume)
    setOpenSidePanel(true)
  }, [])

  const handleSSHKeyClick = useCallback((sshKey: SSHKey) => {
    setSidePanelContentType('sshKey')
    setSelectedSSHKey(sshKey)
    setOpenSidePanel(true)
  }, [])

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
                    <div>{instance ? 'CONFIRMING' : 'LOADING'}</div>
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
      {/* Slider */}
      <StyledSliderContent showLogs={tabId === 'log'}>
        {/* Instance Properties */}
        <div tw="w-full flex flex-wrap gap-x-24 gap-y-9 px-12 py-6">
          <div tw="flex-1 w-1/2 min-w-[32rem] flex flex-col gap-y-9">
            <div>
              <InstanceDetails instance={instance} />
            </div>
            <div>
              <div className="tp-h7 fs-24" tw="uppercase mb-2">
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
                    <FunctionalButton
                      onClick={() => setTabId('log')}
                      disabled={!instance}
                    >
                      <Icon name="eye" />
                      view
                    </FunctionalButton>
                    <FunctionalButton
                      onClick={() => {
                        alert('TODO: add download logs')
                      }}
                      disabled={!instance}
                    >
                      <Icon name="download" />
                      [WIP] download logs
                    </FunctionalButton>
                  </div>
                </div>
              </NoisyContainer>
            </div>
            <div>
              <EntitySSHKeys
                sshKeys={mappedKeys}
                onSSHKeyClick={handleSSHKeyClick}
              />
            </div>
            <div>
              <div className="tp-h7 fs-24" tw="uppercase mb-2">
                PAYMENT
              </div>
              <NoisyContainer>
                <div tw="flex items-center gap-4">
                  <div
                    className="bg-main0 text-base0"
                    tw="flex items-center gap-1 px-3 py-1"
                  >
                    <Logo img="aleph" color="base0" byAleph={false} />
                    <div tw="uppercase font-bold leading-relaxed">ALEPH</div>
                  </div>
                  <p className="text-base2 fs-18" tw="font-bold">
                    {cost}
                  </p>
                </div>
              </NoisyContainer>
            </div>
          </div>
          <div tw="flex-1 w-1/2 min-w-[20rem] flex flex-col gap-y-9">
            <div>
              <EntityHostingCRN
                nodeDetails={nodeDetails}
                termsAndConditionsHash={
                  instance?.requirements?.node?.terms_and_conditions
                }
              />
            </div>
            <div>
              <EntityConnectionMethods executableStatus={status} />
            </div>
            {immutableVolumes.length > 0 && (
              <div>
                <EntityLinkedVolumes
                  linkedVolumes={immutableVolumes}
                  onImmutableVolumeClick={handleImmutableVolumeClick}
                />
              </div>
            )}
            {persistentVolumes.length > 0 && (
              <div>
                <EntityPersistentStorage
                  persistentVolumes={persistentVolumes}
                />
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
        {/* Instance Logs */}
        <div tw="w-full flex px-12 py-6 gap-8">
          <FunctionalButton onClick={() => setTabId('detail')}>
            <Icon name="angle-left" size="1.3em" />
          </FunctionalButton>
          <div tw="w-full flex flex-col justify-center items-center gap-3">
            <div className="tp-h7" tw="w-full text-center">
              LOGS
            </div>
            <div tw="w-full max-w-3xl">
              Real-time logs of the of the virtual machine. Use this to debug
              any issue with the boot of your instance and to monitor the
              behavior of the your instance while it is running.
            </div>
            <div tw="w-full">
              <LogsFeed logs={logs} />
            </div>
          </div>
        </div>
      </StyledSliderContent>
      <SidePanel
        title={sidePanelContentType === 'volume' ? 'Volume' : 'SSH Key'}
        isOpen={openSidePanel}
        onClose={() => setOpenSidePanel(false)}
      >
        {sidePanelContentType === 'volume' ? (
          selectedVolume && <VolumeDetail volumeId={selectedVolume.id} />
        ) : sidePanelContentType === 'sshKey' ? (
          selectedSSHKey && <SSHKeyDetail sshKeyId={selectedSSHKey.id} />
        ) : (
          <>ERROR</>
        )}
      </SidePanel>
      {/* <div tw="fixed right-0 top-0 bottom-0 z-50 w-1/2 bg-white shadow-lg"></div> */}
    </>
  )
}
