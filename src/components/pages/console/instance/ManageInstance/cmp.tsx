import { RotatingLines } from 'react-loader-spinner'
import { ButtonProps, Label, Tooltip } from '@aleph-front/core'
import { Button, Icon } from '@aleph-front/core'
import { useManageInstance } from './hook'
import BackButton from '@/components/common/BackButton'
import { Skeleton } from '@/components/common/Skeleton/cmp'
import { SidePanel } from '@/components/common/SidePanel/cmp'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
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

/**
 * Button component with functional styling
 */
export function FunctionalButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="functional"
      size="sm"
      className="bg-purple0 text-main0"
      tw="px-6 py-2 rounded-full flex items-center justify-center leading-none gap-x-3 font-bold
         transition-all duration-200
         disabled:(opacity-50 cursor-not-allowed)"
      {...props}
    >
      {children}
    </Button>
  )
}

/**
 * ManageInstance component - purely presentational
 * All business logic is in the useManageInstance hook
 */
export default function ManageInstance() {
  const {
    // Basic data
    instance,
    name,
    labelVariant,

    // Status data
    status,
    isRunning,

    // Volumes data
    immutableVolumes,
    persistentVolumes,

    // Action handlers
    handleStop,
    handleStart,
    handleReboot,
    handleDelete,
    handleBack,

    // UI state
    mappedKeys,
    setTabId,
    theme,
    logs,
    sliderActiveIndex,

    // Side panel
    sidePanel,
    handleImmutableVolumeClick,
    handleSSHKeyClick,
    closeSidePanel,

    // Button states
    stopDisabled,
    startDisabled,
    rebootDisabled,

    // Payment data
    paymentData,

    // Logs
    handleDownloadLogs,
    isDownloadingLogs,

    // Node details
    nodeDetails,
  } = useManageInstance()

  return (
    <>
      {/* Header */}
      <section tw="px-12 py-0! md:pt-10! pb-6">
        <div tw=" px-0 py-0! md:pt-10! flex items-center justify-between gap-8">
          <div tw="flex-1">
            <BackButton handleBack={handleBack} />
          </div>
          <div tw="flex flex-col md:flex-row text-center gap-2 items-center justify-center">
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
            <div tw="flex-1 w-1/2 flex flex-col gap-y-9">
              <div>
                <InstanceDetails instance={instance} />
              </div>
              <div>
                <EntityLogsControl
                  onViewLogs={() => setTabId('log')}
                  onDownloadLogs={handleDownloadLogs}
                  downloadingLogs={isDownloadingLogs}
                  disabled={!instance || !isRunning}
                />
              </div>
              <div>
                <EntitySSHKeys
                  sshKeys={mappedKeys}
                  onSSHKeyClick={handleSSHKeyClick}
                />
              </div>
              <div>
                <EntityPayment payments={paymentData} />
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

      {/* Side Panel */}
      <SidePanel
        title={sidePanel.type === 'volume' ? 'Volume' : 'SSH Key'}
        isOpen={sidePanel.isOpen}
        onClose={closeSidePanel}
      >
        {sidePanel.type === 'volume' ? (
          sidePanel.selectedVolume && (
            <VolumeDetail volumeId={sidePanel.selectedVolume.id} />
          )
        ) : sidePanel.type === 'sshKey' ? (
          sidePanel.selectedSSHKey && (
            <SSHKeyDetail sshKeyId={sidePanel.selectedSSHKey.id} />
          )
        ) : (
          <>ERROR</>
        )}
      </SidePanel>
    </>
  )
}
