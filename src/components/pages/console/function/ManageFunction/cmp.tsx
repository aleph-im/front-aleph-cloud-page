import Head from 'next/head'
import { EntityType } from '@/helpers/constants'
import { Icon } from '@aleph-front/core'
import { useManageFunction } from './hook'
import ManageEntityHeader from '@/components/common/entityData/ManageEntityHeader'
import { Slide, Slider } from '@/components/common/Slider'
import EntityDataColumns from '@/components/common/entityData/EntityDataColumns'
import { FunctionalButton } from '../../instance/ManageInstance/cmp'
import {
  EntityLogsContent,
  EntityLogsControl,
} from '@/components/common/entityData/EntityLogs'
import ProgramDetails from '@/components/common/entityData/ProgramDetails'
import EntityLinkedRuntime from '@/components/common/entityData/EntityLinkedRuntime'
import SidePanel from '@/components/common/SidePanel'
import VolumeDetail from '@/components/common/VolumeDetail'
import EntityLinkedCodebase from '@/components/common/entityData/EntityLinkedCodebase'
import EntityPayment from '@/components/common/entityData/EntityPayment'
import EntityHostingCRN from '@/components/common/entityData/EntityHostingCRN'
import EntityLinkedVolumes from '@/components/common/entityData/EntityLinkedVolumes'
import EntityPersistentStorage from '@/components/common/entityData/EntityPersistentStorage'

export default function ManageFunction() {
  const {
    //Basic data
    program,
    name,
    labelVariant,
    isPersistent,

    // Status data
    isAllocated,

    // Node Details
    nodeDetails,

    // Volumes data
    immutableVolumes,
    persistentVolumes,

    // Payment data
    paymentData,

    // Logs
    logs,
    logsDisabled,
    handleDownloadLogs,
    isDownloadingLogs,

    // Action buttons
    stopDisabled,
    handleStop,
    startDisabled,
    handleStart,
    rebootDisabled,
    handleReboot,
    deleteDisabled,
    handleDelete,
    downloadDisabled,
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
        <title>Console | Manage Function - Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your serverless function on Aleph Cloud"
        />
      </Head>
      <ManageEntityHeader
        entity={program}
        name={name}
        type={EntityType.Program}
        labelVariant={labelVariant}
        isAllocated={isAllocated}
        // Start action
        showStart={isPersistent}
        startDisabled={startDisabled}
        onStart={handleStart}
        // Delete action
        showDelete
        deleteDisabled={deleteDisabled}
        onDelete={handleDelete}
        // Stop action
        showStop={isPersistent}
        stopDisabled={stopDisabled}
        onStop={handleStop}
        // Reboot action
        showReboot={isPersistent}
        rebootDisabled={rebootDisabled}
        onReboot={handleReboot}
        // Download action
        showDownload
        downloadDisabled={downloadDisabled}
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
              immutableVolumes.length > 0 && (
                <EntityLinkedVolumes
                  key="instance-linked-volumes"
                  linkedVolumes={immutableVolumes}
                  onImmutableVolumeClick={handleImmutableVolumeClick}
                />
              ),
              persistentVolumes.length > 0 && (
                <EntityPersistentStorage
                  key="instance-persistent-storage"
                  persistentVolumes={persistentVolumes}
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
        ) : (
          <>ERROR</>
        )}
      </SidePanel>
    </>
  )
}
