import { RotatingLines } from 'react-loader-spinner'
import { ButtonProps, Label, Tooltip } from '@aleph-front/core'
import { Button, Icon } from '@aleph-front/core'
import { useManageInstance } from '@/hooks/pages/solutions/manage/useManageInstance'
import {
  ellipseAddress,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import BackButton from '@/components/common/BackButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ImmutableVolume } from '@aleph-sdk/message'
import { useAppState } from '@/contexts/appState'
import { Skeleton } from '@/components/common/Skeleton/cmp'
import { SidePanel } from '@/components/common/SidePanel/cmp'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
import { SSHKey } from '@/domain/ssh'
import VolumeDetail from '@/components/common/VolumeDetail'
import { Slide, Slider } from '@/components/common/Slider/cmp'
import EntityPayment from '@/components/common/entityData/EntityPayment'
import InstanceDetails from '@/components/common/entityData/InstanceDetails'
import {
  EntityLogsContent,
  EntityLogsControl,
} from '@/components/common/entityData/EntityLogs'
import EntityPersistentStorage from '@/components/common/entityData/EntityPersistentStorage'
import EntityLinkedVolumes from '@/components/common/entityData/EntityLinkedVolumes'
import EntityConnectionMethods from '@/components/common/entityData/EntityConnectionMethods'
import EntityHostingCRN from '@/components/common/entityData/EntityHostingCRN'
import EntitySSHKeys from '@/components/common/entityData/EntitySSHKeys'

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
    paymentData,
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
    manager: { volumeManager },
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

  // Cost calculation now handled inside EntityPayment component

  const sliderActiveIndex = useMemo(() => {
    return tabId === 'log' ? 1 : 0
  }, [tabId])

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
      <Slider activeIndex={sliderActiveIndex}>
        {/* Instance Properties */}
        <Slide>
          <div tw="w-full flex flex-wrap gap-x-24 gap-y-9 px-12 py-6 transition-transform duration-1000">
            <div tw="flex-1 w-1/2 min-w-[32rem] flex flex-col gap-y-9">
              <div>
                <InstanceDetails instance={instance} />
              </div>
              <div>
                <EntityLogsControl
                  onViewLogs={() => setTabId('log')}
                  onDownloadLogs={() => alert('TODO: add download logs')}
                  disabled={!instance}
                />
              </div>
              <div>
                <EntitySSHKeys
                  sshKeys={mappedKeys}
                  onSSHKeyClick={handleSSHKeyClick}
                />
              </div>
              <div>
                <EntityPayment
                  cost={paymentData.cost}
                  paymentType={paymentData.paymentType}
                  runningTime={paymentData.runningTime}
                  startTime={paymentData.startTime}
                  blockchain={paymentData.blockchain}
                  loading={paymentData.loading}
                />
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
            </div>
          </div>
        </Slide>
        {/* Instance Logs */}
        <Slide>
          <div tw="w-full flex px-12 py-6 gap-8">
            <FunctionalButton onClick={() => setTabId('detail')}>
              <Icon name="angle-left" size="1.3em" />
            </FunctionalButton>
            <div tw="w-full flex flex-col justify-center items-center gap-3">
              <EntityLogsContent logs={logs} />
            </div>
          </div>
        </Slide>
      </Slider>
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
