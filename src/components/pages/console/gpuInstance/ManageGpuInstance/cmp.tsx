import Head from 'next/head'
import { Icon } from '@aleph-front/core'
import { useManageGpuInstance } from './hook'
import ManageEntityHeader from '@/components/common/entityData/ManageEntityHeader'
import { Slide, Slider } from '@/components/common/Slider'
import EntityDataColumns from '@/components/common/entityData/EntityDataColumns'
import InstanceEntityDetails from '@/components/common/entityData/InstanceEntityDetails'
import {
  EntityLogsContent,
  EntityLogsControl,
} from '@/components/common/entityData/EntityLogs'
import EntitySSHKeys from '@/components/common/entityData/EntitySSHKeys'
import EntityPayment from '@/components/common/entityData/EntityPayment'
import EntityHostingCRN from '@/components/common/entityData/EntityHostingCRN'
import EntityConnectionMethods from '@/components/common/entityData/EntityConnectionMethods'
import EntityLinkedVolumes from '@/components/common/entityData/EntityLinkedVolumes'
import EntityPersistentStorage from '@/components/common/entityData/EntityPersistentStorage'
import EntityCustomDomains from '@/components/common/entityData/EntityCustomDomains'
import EntityPortForwarding from '@/components/common/entityData/EntityPortForwarding'
import FunctionalButton from '@/components/common/FunctionalButton'
import SidePanel from '@/components/common/SidePanel'
import VolumeDetail from '@/components/common/VolumeDetail'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
import DomainDetail from '@/components/common/DomainDetail'

export default function ManageGpuInstance() {
  const {
    // Basic data
    gpuInstance,
    gpuInstanceManager,
    name,

    // Status data
    status,
    calculatedStatus,
    isAllocated,

    // Node details
    nodeDetails,

    // Volumes data
    immutableVolumes,
    persistentVolumes,

    // SSH Keys
    mappedKeys,

    // Custom domains
    customDomains,
    handleCustomDomainClick,

    // Payment data
    paymentData,

    // Logs
    logs,
    handleDownloadLogs,
    isDownloadingLogs,

    // Action buttons
    stopDisabled,
    stopLoading,
    handleStop,
    startDisabled,
    startLoading,
    handleStart,
    rebootDisabled,
    rebootLoading,
    handleReboot,
    deleteDisabled,
    deleteLoading,
    handleDelete,

    // Side panel
    sidePanel,
    handleImmutableVolumeClick,
    handleSSHKeyClick,
    closeSidePanel,

    // UI state
    setTabId,
    sliderActiveIndex,

    // Navigation handlers
    handleBack,

    // Ports
    ports,
    sshForwardedPort,
    handlePortsChange,
  } = useManageGpuInstance()

  return (
    <>
      <Head>
        <title>Console | Manage GPU Instance | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your compute instance on Aleph Cloud"
        />
      </Head>
      <ManageEntityHeader
        entity={gpuInstance}
        name={name}
        type="GPU instance"
        isAllocated={isAllocated}
        calculatedStatus={calculatedStatus}
        // Start action
        showStart
        startDisabled={startDisabled}
        startLoading={startLoading}
        onStart={handleStart}
        // Delete action
        showDelete
        deleteDisabled={deleteDisabled}
        deleteLoading={deleteLoading}
        onDelete={handleDelete}
        // Stop action
        showStop
        stopDisabled={stopDisabled}
        stopLoading={stopLoading}
        onStop={handleStop}
        // Reboot action
        showReboot
        rebootDisabled={rebootDisabled}
        rebootLoading={rebootLoading}
        onReboot={handleReboot}
        // Go back action
        onBack={handleBack}
      />
      {/* Slider */}
      <Slider activeIndex={sliderActiveIndex}>
        {/* Instance Properties */}
        <Slide>
          <EntityDataColumns
            leftColumnElements={[
              <InstanceEntityDetails
                key="gpuInstance-details"
                entity={gpuInstance}
                title="GPU INSTANCE"
              />,
              <EntityLogsControl
                key="gpuInstance-logs-control"
                onViewLogs={() => setTabId('log')}
                onDownloadLogs={handleDownloadLogs}
                downloadingLogs={isDownloadingLogs}
                disabled={!gpuInstance || !isAllocated}
              />,
              <EntitySSHKeys
                key="gpuInstance-ssh-keys"
                sshKeys={mappedKeys}
                onSSHKeyClick={handleSSHKeyClick}
              />,
              <EntityPayment
                key="gpuInstance-payment"
                payments={paymentData}
              />,
            ]}
            rightColumnElements={[
              <EntityHostingCRN
                key={'gpuInstance-hosting-crn'}
                nodeDetails={nodeDetails}
                termsAndConditionsHash={
                  gpuInstance?.requirements?.node?.terms_and_conditions
                }
              />,
              <EntityConnectionMethods
                key="gpuInstance-connection-methods"
                executableStatus={status}
                sshForwardedPort={sshForwardedPort}
              />,
              immutableVolumes.length && (
                <EntityLinkedVolumes
                  key="gpuInstance-linked-volumes"
                  linkedVolumes={immutableVolumes}
                  onImmutableVolumeClick={handleImmutableVolumeClick}
                />
              ),
              persistentVolumes.length && (
                <EntityPersistentStorage
                  key="gpuInstance-persistent-storage"
                  persistentVolumes={persistentVolumes}
                />
              ),
              customDomains.length && (
                <EntityCustomDomains
                  key={'gpuInstance-custom-domains'}
                  customDomains={customDomains}
                  onCustomDomainClick={handleCustomDomainClick}
                />
              ),
              <EntityPortForwarding
                key="port-forwarding"
                entityHash={gpuInstance?.id}
                executableStatus={status}
                executableManager={gpuInstanceManager}
                ports={ports}
                onPortsChange={handlePortsChange}
              />,
            ]}
          />
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
        title={
          sidePanel.type === 'volume'
            ? 'Volume'
            : sidePanel.type === 'sshKey'
              ? 'SSH Key'
              : 'Custom Domain'
        }
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
        ) : sidePanel.type === 'domain' ? (
          sidePanel.selectedDomain && (
            <DomainDetail domainId={sidePanel.selectedDomain.id} />
          )
        ) : (
          <>ERROR</>
        )}
      </SidePanel>
    </>
  )
}
