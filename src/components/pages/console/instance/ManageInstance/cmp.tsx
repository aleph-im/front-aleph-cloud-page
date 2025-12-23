import Head from 'next/head'
import { useManageInstance } from './hook'
import { SidePanel } from '@/components/common/SidePanel/cmp'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
import VolumeDetail from '@/components/common/VolumeDetail'
import EntityPayment from '@/components/common/entityData/EntityPayment'
import InstanceEntityDetails from '@/components/common/entityData/InstanceEntityDetails'
import {
  EntityLogsContent,
  EntityLogsControl,
} from '@/components/common/entityData/EntityLogs'
import EntityPersistentStorage from '@/components/common/entityData/EntityPersistentStorage'
import EntityLinkedVolumes from '@/components/common/entityData/EntityLinkedVolumes'
import EntityConnectionMethods from '@/components/common/entityData/EntityConnectionMethods'
import EntityHostingCRN from '@/components/common/entityData/EntityHostingCRN'
import EntitySSHKeys from '@/components/common/entityData/EntitySSHKeys'
import { EntityDomainType, EntityType } from '@/helpers/constants'
import ManageEntityHeader from '@/components/common/entityData/ManageEntityHeader'
import EntityDataColumns from '@/components/common/entityData/EntityDataColumns'
import EntityCustomDomains from '@/components/common/entityData/EntityCustomDomains'
import DomainDetail from '@/components/common/DomainDetail'
import EntityPortForwarding from '@/components/common/entityData/EntityPortForwarding'
import NewDomainForm from '@/components/common/NewDomainForm'

/**
 * ManageInstance component - purely presentational
 * All business logic is in the useManageInstance hook
 */
export default function ManageInstance() {
  const {
    // Basic data
    instance,
    instanceManager,
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
  } = useManageInstance()

  return (
    <>
      <Head>
        <title>Console | Manage Instance | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your compute instance on Aleph Cloud"
        />
      </Head>
      <ManageEntityHeader
        entity={instance}
        name={name}
        type={EntityType.Instance}
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
          <InstanceEntityDetails key="instance-details" entity={instance} />,
          <EntityLogsControl
            key="instance-logs-control"
            onViewLogs={handleViewLogs}
            onDownloadLogs={handleDownloadLogs}
            downloadingLogs={isDownloadingLogs}
            disabled={!instance || !isAllocated}
          />,
          <EntitySSHKeys
            key="instance-ssh-keys"
            sshKeys={mappedKeys}
            onSSHKeyClick={handleSSHKeyClick}
          />,
          <EntityPayment key="instance-payment" payments={paymentData} />,
        ]}
        rightColumnElements={[
          <EntityHostingCRN
            key={'instance-hosting-crn'}
            nodeDetails={nodeDetails}
            termsAndConditionsHash={
              instance?.requirements?.node?.terms_and_conditions
            }
          />,
          <EntityConnectionMethods
            key="instance-connection-methods"
            executableStatus={status}
            sshForwardedPort={sshForwardedPort}
          />,
          immutableVolumes.length && (
            <EntityLinkedVolumes
              key="instance-linked-volumes"
              linkedVolumes={immutableVolumes}
              onImmutableVolumeClick={handleImmutableVolumeClick}
            />
          ),
          persistentVolumes.length && (
            <EntityPersistentStorage
              key="instance-persistent-storage"
              persistentVolumes={persistentVolumes}
            />
          ),
          <EntityCustomDomains
            key={'instance-custom-domains'}
            isLoadingCustomDomains={isLoadingCustomDomains}
            customDomains={customDomains}
            onCustomDomainClick={handleCustomDomainClick}
            onAddDomain={handleAddDomain}
          />,
          <EntityPortForwarding
            key="port-forwarding"
            entityHash={instance?.id}
            executableStatus={status}
            executableManager={instanceManager}
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
            entityId={instance?.id}
            entityType={EntityDomainType.Instance}
            onSuccess={closeSidePanel}
          />
        ) : (
          <>ERROR</>
        )}
      </SidePanel>
    </>
  )
}
