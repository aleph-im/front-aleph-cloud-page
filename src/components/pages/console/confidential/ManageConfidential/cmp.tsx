import Head from 'next/head'
import { useManageGpuInstance } from './hook'
import ManageEntityHeader from '@/components/common/entityData/ManageEntityHeader'
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
import { EntityDomainType } from '@/helpers/constants'
import SidePanel from '@/components/common/SidePanel'
import VolumeDetail from '@/components/common/VolumeDetail'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
import DomainDetail from '@/components/common/DomainDetail'
import NewDomainForm from '@/components/common/NewDomainForm'

export default function ManageConfidential() {
  const {
    // Basic data
    confidentialInstance,
    confidentialInstanceManager,
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
    isLoadingCustomDomains,
    handleCustomDomainClick,
    handleAddDomain,

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
    handleViewLogs,
    closeSidePanel,

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
        <title>Console | Manage TEE Instance | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your compute instance on Aleph Cloud"
        />
      </Head>
      <ManageEntityHeader
        entity={confidentialInstance}
        name={name}
        type="TEE instance"
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
      {/* Instance Properties */}
      <EntityDataColumns
        leftColumnElements={[
          <InstanceEntityDetails
            key="confidentialInstance-details"
            entity={confidentialInstance}
            title="TEE INSTANCE"
          />,
          <EntityLogsControl
            key="confidentialInstance-logs-control"
            onViewLogs={handleViewLogs}
            onDownloadLogs={handleDownloadLogs}
            downloadingLogs={isDownloadingLogs}
            disabled={!confidentialInstance || !isAllocated}
          />,
          <EntitySSHKeys
            key="confidentialInstance-ssh-keys"
            sshKeys={mappedKeys}
            onSSHKeyClick={handleSSHKeyClick}
          />,
          <EntityPayment
            key="confidentialInstance-payment"
            payments={paymentData}
          />,
        ]}
        rightColumnElements={[
          <EntityHostingCRN
            key={'confidentialInstance-hosting-crn'}
            nodeDetails={nodeDetails}
            termsAndConditionsHash={
              confidentialInstance?.requirements?.node?.terms_and_conditions
            }
          />,
          <EntityConnectionMethods
            key="confidentialInstance-connection-methods"
            executableStatus={status}
            sshForwardedPort={sshForwardedPort}
          />,
          immutableVolumes.length && (
            <EntityLinkedVolumes
              key="confidentialInstance-linked-volumes"
              linkedVolumes={immutableVolumes}
              onImmutableVolumeClick={handleImmutableVolumeClick}
            />
          ),
          persistentVolumes.length && (
            <EntityPersistentStorage
              key="confidentialInstance-persistent-storage"
              persistentVolumes={persistentVolumes}
            />
          ),
          customDomains.length && (
            <EntityCustomDomains
              key={'confidentialInstance-custom-domains'}
              isLoadingCustomDomains={isLoadingCustomDomains}
              customDomains={customDomains}
              onCustomDomainClick={handleCustomDomainClick}
              onAddDomain={handleAddDomain}
            />
          ),
          <EntityPortForwarding
            key="port-forwarding"
            entityHash={confidentialInstance?.id}
            executableStatus={status}
            executableManager={confidentialInstanceManager}
            ports={ports}
            onPortsChange={handlePortsChange}
          />,
        ]}
      />

      {/* Side Panel */}
      <SidePanel
        title={
          sidePanel.type === 'volume'
            ? 'Volume'
            : sidePanel.type === 'sshKey'
              ? 'SSH Key'
              : sidePanel.type === 'logs'
                ? 'Logs'
                : sidePanel.type === 'newDomain'
                  ? 'New Custom Domain'
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
        ) : sidePanel.type === 'logs' ? (
          <EntityLogsContent logs={logs} />
        ) : sidePanel.type === 'newDomain' ? (
          <NewDomainForm
            entityId={confidentialInstance?.id}
            entityType={EntityDomainType.Confidential}
            onSuccess={closeSidePanel}
          />
        ) : (
          <>ERROR</>
        )}
      </SidePanel>
    </>
  )
}
