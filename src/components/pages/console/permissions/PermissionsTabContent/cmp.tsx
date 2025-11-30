import React from 'react'
import { PermissionsTabContentProps } from './types'
import { getPermissionsTableColumns } from './columns'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { AccountPermissions } from '@/domain/permissions'
import SidePanel from '@/components/common/SidePanel'
import PermissionsDetail from '@/components/common/PermissionsDetail'
import { Button, TextGradient, useModal } from '@aleph-front/core'

// Type for side panel content
type SidePanelContent = {
  isOpen: boolean
  title: string
  type?: 'configure'
  selectedRow?: AccountPermissions
}

export const PermissionsTabContent = React.memo(
  ({ data, onPermissionChange }: PermissionsTabContentProps) => {
    const [sidePanel, setSidePanel] = React.useState<SidePanelContent>({
      isOpen: false,
      title: '',
    })
    const [originalPermissions, setOriginalPermissions] =
      React.useState<AccountPermissions[]>(data)
    const [updatedPermissions, setUpdatedPermissions] = React.useState<
      AccountPermissions[]
    >(structuredClone(data))
    const [isCurrentFormDirty, setIsCurrentFormDirty] = React.useState(false)
    const [isChannelsPanelOpen, setIsChannelsPanelOpen] = React.useState(false)
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] =
      React.useState(false)

    const modal = useModal()
    const modalOpen = modal?.open
    const modalClose = modal?.close

    // Sync with data prop changes
    React.useEffect(() => {
      setOriginalPermissions(data)
      setUpdatedPermissions(structuredClone(data))
    }, [data])

    const handleRowConfigure = (row: AccountPermissions) => {
      console.log('Configure permission:', row)
      // Find corresponding permission from updatedPermissions
      const permission = updatedPermissions.find((p) => p.id === row.id) || row
      setSidePanel({
        isOpen: true,
        title: 'Permissions',
        type: 'configure',
        selectedRow: permission,
      })
    }

    const handleRowRevoke = (row: AccountPermissions) => {
      console.log('Revoke permission:', row)
      // @todo: strike text elements in the row to indicate revocation, disable
      // "configure" action, and switch "revoke" to "restore" action.
      // Also add opacity to the row.
    }

    const handleRowClick = (row: AccountPermissions, index: number) => {
      console.log(`row click ${index}`)
      handleRowConfigure(row)
    }

    const handlePermissionUpdate = React.useCallback(
      (updatedPermission: AccountPermissions) => {
        // Update the specific permission in updatedPermissions
        setUpdatedPermissions((prev) =>
          prev.map((p) =>
            p.id === updatedPermission.id ? updatedPermission : p,
          ),
        )
        // Call the parent's onPermissionChange immediately
        onPermissionChange?.(updatedPermission)
        // Sync original with updated after successful update
        setOriginalPermissions((prev) =>
          prev.map((p) =>
            p.id === updatedPermission.id ? updatedPermission : p,
          ),
        )
        setSidePanel((prev) => ({ ...prev, isOpen: false }))
        setIsCurrentFormDirty(false)
      },
      [onPermissionChange],
    )

    const handleCancelClick = React.useCallback(() => {
      // Just close panel - form changes are discarded automatically
      setSidePanel((prev) => ({ ...prev, isOpen: false }))
      setIsCurrentFormDirty(false)
    }, [])

    const handleClosePanel = React.useCallback(() => {
      setSidePanel((prev) => ({ ...prev, isOpen: false }))

      if (isCurrentFormDirty) {
        setShowUnsavedChangesModal(true)
      }
    }, [isCurrentFormDirty])

    const handleDiscardChanges = React.useCallback(() => {
      setShowUnsavedChangesModal(false)
      setIsCurrentFormDirty(false)
      modalClose?.()
    }, [modalClose])

    const handleCancelDiscard = React.useCallback(() => {
      setShowUnsavedChangesModal(false)
      setSidePanel((prev) => ({ ...prev, isOpen: true }))
      modalClose?.()
    }, [modalClose])

    const columns = getPermissionsTableColumns({
      onRowConfigure: handleRowConfigure,
      onRowRevoke: handleRowRevoke,
    })

    React.useEffect(
      () => {
        if (!modalOpen) return
        if (!modalClose) return

        if (showUnsavedChangesModal) {
          return modalOpen({
            header: <TextGradient type="h6">Unsaved Changes</TextGradient>,
            width: '34rem',
            closeOnClickOutside: false,
            closeOnCloseButton: false,
            content: (
              <div tw="mb-8">
                <p className="tp-body">
                  You&apos;ve made updates to your permission settings.
                </p>
                <p className="tp-body">
                  If you leave now, these changes won&apos;t be saved.
                </p>
              </div>
            ),
            footer: (
              <div tw="w-full flex justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleCancelDiscard}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleDiscardChanges}
                >
                  Discard Changes
                </Button>
              </div>
            ),
          })
        } else {
          return modalClose()
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        showUnsavedChangesModal,
        handleDiscardChanges,
        handleCancelDiscard,
        /*
        Both modalOpen and modalClose are not included in the dependencies because there's
        an infinite refresh loop when they are included. This is because the modalOpen
        and modalClose functions are being redefined on every render, causing the
        useEffect to run again and again.
         */
        // modalOpen,
        // modalClose,
      ],
    )

    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                clickableRows
                rowKey={({ id }: AccountPermissions) => id}
                data={updatedPermissions}
                columns={columns}
                rowProps={(row: AccountPermissions, i: number) => ({
                  onClick: () => handleRowClick(row, i),
                })}
              />
            </div>

            <div tw="mt-20 text-center">
              <ButtonLink variant="primary" href="/console/permissions/new">
                Create permissions
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/console/permissions/new">
              Create permissions
            </ButtonLink>
          </div>
        )}
        <SidePanel
          isOpen={sidePanel.isOpen}
          onClose={handleClosePanel}
          title={sidePanel.title}
          width="60vw"
          mobileHeight="80vh"
          footer={
            sidePanel.type === 'configure' &&
            sidePanel.selectedRow &&
            isCurrentFormDirty && (
              <div tw="flex justify-start gap-x-4">
                <Button
                  type="submit"
                  color="main0"
                  kind="functional"
                  variant="warning"
                  form="permissions-detail-form"
                >
                  Continue
                </Button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="tp-header fs-14"
                  tw="not-italic font-bold"
                >
                  Cancel
                </button>
              </div>
            )
          }
        >
          {sidePanel.type === 'configure' ? (
            sidePanel.selectedRow && (
              <PermissionsDetail
                permissions={sidePanel.selectedRow}
                onDirtyChange={setIsCurrentFormDirty}
                onUpdate={handlePermissionUpdate}
                onOpenChannelsPanel={() => setIsChannelsPanelOpen(true)}
              />
            )
          ) : (
            <>ERROR</>
          )}
        </SidePanel>
        <SidePanel
          isOpen={isChannelsPanelOpen}
          onClose={() => setIsChannelsPanelOpen(false)}
          title="Channels"
          order={1}
          width="50vw"
          mobileHeight="70vh"
        >
          <div>test</div>
        </SidePanel>
      </>
    )
  },
)
PermissionsTabContent.displayName = 'PermissionsTabContent'

export default PermissionsTabContent
