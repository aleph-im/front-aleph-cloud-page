import Head from 'next/head'
import { Icon } from '@aleph-front/core'
import { useManageFunction } from './hook'
import ManageEntityHeader from '@/components/common/entityData/ManageEntityHeader'
import { Slide, Slider } from '@/components/common/Slider'
import EntityDataColumns from '@/components/common/entityData/EntityDataColumns'
import {
  EntityLogsContent,
  EntityLogsControl,
} from '@/components/common/entityData/EntityLogs'
import ProgramDetails from '@/components/common/entityData/ProgramDetails'
import EntityLinkedRuntime from '@/components/common/entityData/EntityLinkedRuntime'
import SidePanel from '@/components/common/SidePanel'
import VolumeDetail from '@/components/common/VolumeDetail'
import DomainDetail from '@/components/common/DomainDetail'
import EntityLinkedCodebase from '@/components/common/entityData/EntityLinkedCodebase'
import EntityPayment from '@/components/common/entityData/EntityPayment'
import EntityHostingCRN from '@/components/common/entityData/EntityHostingCRN'
import EntityLinkedVolumes from '@/components/common/entityData/EntityLinkedVolumes'
import EntityPersistentStorage from '@/components/common/entityData/EntityPersistentStorage'
import EntityCustomDomains from '@/components/common/entityData/EntityCustomDomains'
import FunctionalButton from '@/components/common/FunctionalButton'

export default function ManageFunction() {
  const {
    //Basic data
    program,
    name,
    isPersistent,

    // Status data
    calculatedStatus,
    isAllocated,

    // Node Details
    nodeDetails,

    // Volumes data
    immutableVolumes,
    persistentVolumes,

    // Custom domains
    customDomains,
    handleCustomDomainClick,

    // Payment data
    paymentData,

    // Logs
    logs,
    logsDisabled,
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
    downloadDisabled,
    downloadLoading,
    handleDownload,

    // UI state
    setTabId,
    sliderActiveIndex,
    sidePanel,
    closeSidePanel,
    handleRuntimeVolumeClick,
    handleCodebaseVolumeClick,
    handleImmutableVolumeClick,

    // Action handlers
    handleBack,
  } = useManageFunction()

  return (
    <>
      <Head>
        <title>Console | Manage Function | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your serverless function on Aleph Cloud"
        />
      </Head>
      <ManageEntityHeader
        entity={program}
        name={name}
        type={'function'}
        isAllocated={isAllocated}
        calculatedStatus={calculatedStatus}
        // Start action
        showStart={isPersistent}
        startDisabled={startDisabled}
        startLoading={startLoading}
        onStart={handleStart}
        // Delete action
        showDelete
        deleteDisabled={deleteDisabled}
        deleteLoading={deleteLoading}
        onDelete={handleDelete}
        // Stop action
        showStop={isPersistent}
        stopDisabled={stopDisabled}
        stopLoading={stopLoading}
        onStop={handleStop}
        // Reboot action
        showReboot={isPersistent}
        rebootDisabled={rebootDisabled}
        rebootLoading={rebootLoading}
        onReboot={handleReboot}
        // Download action
        showDownload
        downloadDisabled={downloadDisabled}
        downloadLoading={downloadLoading}
        onDownload={handleDownload}
        // Go back action
        onBack={handleBack}
      />

      {/* Slider */}
      <Slider activeIndex={sliderActiveIndex}>
        {/* Properties */}
        <Slide>
          <EntityDataColumns
            leftColumnElements={[
              <ProgramDetails key="function-details" program={program} />,
              isPersistent && (
                <EntityLogsControl
                  key="instance-logs-control"
                  onViewLogs={() => setTabId('log')}
                  onDownloadLogs={handleDownloadLogs}
                  downloadingLogs={isDownloadingLogs}
                  disabled={logsDisabled}
                />
              ),
              <EntityPayment key="instance-payment" payments={paymentData} />,
            ]}
            rightColumnElements={[
              nodeDetails && (
                <EntityHostingCRN
                  key={'instance-hosting-crn'}
                  nodeDetails={nodeDetails}
                  termsAndConditionsHash={
                    program?.requirements?.node?.terms_and_conditions
                  }
                />
              ),
              <EntityLinkedRuntime
                key="function-runtime"
                loading={!program}
                runtimeVolumeId={program?.runtime.ref}
                comment={program?.runtime.comment}
                onRuntimeVolumeClick={handleRuntimeVolumeClick}
              />,
              <EntityLinkedCodebase
                key="function-runtime"
                loading={!program}
                codebaseVolumeId={program?.code.ref}
                entrypoint={program?.code.entrypoint}
                onCodebaseVolumeClick={handleCodebaseVolumeClick}
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
              customDomains.length && (
                <EntityCustomDomains
                  key={'function-custom-domains'}
                  customDomains={customDomains}
                  onCustomDomainClick={handleCustomDomainClick}
                />
              ),
            ]}
          />
        </Slide>

        {/* Logs */}
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
        title={sidePanel.title}
        isOpen={sidePanel.isOpen}
        onClose={closeSidePanel}
      >
        {sidePanel.type === 'volume' ? (
          sidePanel.selectedVolumeId && (
            <VolumeDetail volumeId={sidePanel.selectedVolumeId} />
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
