import Head from 'next/head'
import { useManageDomain } from './hook'
import EntityDataColumns from '@/components/common/entityData/EntityDataColumns'
import DomainEntityDetails from '@/components/common/entityData/DomainEntityDetails'
import DomainLinkedResource from '@/components/common/entityData/DomainLinkedResource'
import DomainNameSection from '@/components/common/entityData/DomainNameSection'
import DomainDnsConfiguration from '@/components/common/entityData/DomainDnsConfiguration'
import DomainManageHeader from '@/components/common/entityData/DomainManageHeader'

export default function ManageDomain() {
  const {
    // Basic data
    domain,
    name,

    // Status
    status,

    // Linked resource
    refEntity,
    account,

    // Action handlers
    handleDelete,
    deleteDisabled,
    deleteLoading,
    handleUpdate,
    updateDisabled,
    handleRetry,
    handleSaveName,

    // Copy handlers
    handleCopyRef,

    // Navigation
    handleBack,
  } = useManageDomain()

  return (
    <>
      <Head>
        <title>Console | Manage Domain | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your domain settings on Aleph Cloud"
        />
      </Head>
      <DomainManageHeader
        domain={domain}
        name={name}
        status={status}
        // Update action
        updateDisabled={updateDisabled}
        onUpdate={handleUpdate}
        // Delete action
        deleteDisabled={deleteDisabled}
        deleteLoading={deleteLoading}
        onDelete={handleDelete}
        // Go back action
        onBack={handleBack}
      />
      <EntityDataColumns
        leftColumnElements={[
          <DomainEntityDetails
            key="domain-details"
            domain={domain}
            onCopyRef={handleCopyRef}
          />,
          <DomainLinkedResource
            key="domain-linked"
            domain={domain}
            refEntity={refEntity}
          />,
        ]}
        rightColumnElements={[
          <DomainNameSection
            key="domain-name"
            domain={domain}
            status={status}
            onSave={handleSaveName}
          />,
          <DomainDnsConfiguration
            key="domain-dns"
            domain={domain}
            status={status}
            account={account}
            onRetry={handleRetry}
          />,
        ]}
      />
    </>
  )
}
