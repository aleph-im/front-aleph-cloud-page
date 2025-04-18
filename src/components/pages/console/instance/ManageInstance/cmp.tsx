import Head from 'next/head'
import { ButtonProps } from '@aleph-front/core'
import { Button, Icon } from '@aleph-front/core'
import { useManageInstance } from './hook'
import { SidePanel } from '@/components/common/SidePanel/cmp'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
import VolumeDetail from '@/components/common/VolumeDetail'
import { Slide, Slider } from '@/components/common/Slider'
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
import { EntityType } from '@/helpers/constants'
import ManageEntityHeader from '@/components/common/entityData/ManageEntityHeader'

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
    isAllocated,

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
    deleteDisabled,

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
      <Head>
        <title>Console | Manage Instance - Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your compute instance on Aleph Cloud"
        />
      </Head>
      <ManageEntityHeader
        entity={instance}
        name={name}
        type={EntityType.Instance}
        labelVariant={labelVariant}
        isAllocated={isAllocated}
        // Start action
        showStart
        startDisabled={startDisabled}
        onStart={handleStart}
        // Delete action
        showDelete
        deleteDisabled={deleteDisabled}
        onDelete={handleDelete}
        // Stop action
        showStop
        stopDisabled={stopDisabled}
        onStop={handleStop}
        // Reboot action
        showReboot
        rebootDisabled={rebootDisabled}
        onReboot={handleReboot}
        // Go back action
        onBack={handleBack}
      />
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
                  disabled={!instance || !isAllocated}
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
