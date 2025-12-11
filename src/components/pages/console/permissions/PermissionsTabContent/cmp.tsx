import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import PermissionsDetail from '@/components/common/PermissionsDetail'
import SidePanel from '@/components/common/SidePanel'
import { AccountPermissions } from '@/domain/permissions'
import { Button, TextGradient, useModal } from '@aleph-front/core'
import { memo, useCallback, useEffect, useState } from 'react'
import { getPermissionsTableColumns } from './columns'
import { PermissionsTabContentProps } from './types'

// Type for side panel content
type SidePanelContent = {
  isOpen: boolean
  title: string
  type?: 'configure'
  selectedRow?: AccountPermissions
}

export const PermissionsTabContent = memo(
  ({ data, onPermissionChange }: PermissionsTabContentProps) => {
    const [sidePanel, setSidePanel] = useState<SidePanelContent>({
      isOpen: false,
      title: '',
    })

    const [showUnsavedChangesModal, setShowUnsavedChangesModal] =
      useState(false)

    // State to track pending changes in permissions
    const [updatedPermissions, setUpdatedPermissions] =
      useState<AccountPermissions[]>(data)

    // Track currently editing permission to detect unsaved changes
    const [editingOriginalPermission, setEditingOriginalPermission] =
      useState<AccountPermissions | null>(null)

    const modal = useModal()
    const modalOpen = modal?.open
    const modalClose = modal?.close

    // Sync with data prop changes
    useEffect(() => {
      setUpdatedPermissions(data)
    }, [data])

    // Keep sidePanel.selectedRow in sync with updatedPermissions
    useEffect(() => {
      if (sidePanel.selectedRow && sidePanel.isOpen) {
        const currentPermission = updatedPermissions.find(
          (p) => p.id === sidePanel.selectedRow?.id,
        )
        if (currentPermission && currentPermission !== sidePanel.selectedRow) {
          setSidePanel((prev) => ({
            ...prev,
            selectedRow: currentPermission,
          }))
        }
      }
    }, [updatedPermissions, sidePanel.selectedRow, sidePanel.isOpen])

    const handleRowConfigure = (row: AccountPermissions) => {
      console.log('Configure permission:', row)
      // Find corresponding permission from updatedPermissions
      const permission = updatedPermissions.find((p) => p.id === row.id) || row
      // Store the original permission for comparison when closing
      setEditingOriginalPermission(permission)
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

    // Real-time update handler - updates local state as form changes
    const handlePermissionUpdate = useCallback(
      (updatedPermission: AccountPermissions) => {
        setUpdatedPermissions((prev) =>
          prev.map((p) =>
            p.id === updatedPermission.id ? updatedPermission : p,
          ),
        )
      },
      [],
    )

    // Submit handler - called when user clicks "Continue"
    const handlePermissionSubmit = useCallback(
      (updatedPermission: AccountPermissions) => {
        // Update the specific permission in updatedPermissions
        setUpdatedPermissions((prev) =>
          prev.map((p) =>
            p.id === updatedPermission.id ? updatedPermission : p,
          ),
        )
        // Call the parent's onPermissionChange immediately
        onPermissionChange?.(updatedPermission)
        // Clear state and close panel
        setEditingOriginalPermission(null)
        setSidePanel({ isOpen: false, title: '' })
      },
      [onPermissionChange],
    )

    const handleCancelClick = useCallback(() => {
      // Revert the permission to its original state (discard changes)
      if (editingOriginalPermission) {
        setUpdatedPermissions((prev) =>
          prev.map((p) =>
            p.id === editingOriginalPermission.id
              ? editingOriginalPermission
              : p,
          ),
        )
      }
      setEditingOriginalPermission(null)
      setSidePanel({ isOpen: false, title: '' })
    }, [editingOriginalPermission])

    const handleClosePanel = useCallback(() => {
      setSidePanel((prev) => ({ ...prev, isOpen: false }))

      // Compare current permission with original to detect changes
      if (editingOriginalPermission) {
        const currentPermission = updatedPermissions.find(
          (p) => p.id === editingOriginalPermission.id,
        )
        const hasChanges =
          JSON.stringify(currentPermission) !==
          JSON.stringify(editingOriginalPermission)

        if (hasChanges) {
          setShowUnsavedChangesModal(true)
        } else {
          // No changes - clear state completely
          setEditingOriginalPermission(null)
          setSidePanel({ isOpen: false, title: '' })
        }
      }
    }, [editingOriginalPermission, updatedPermissions])

    const handleDiscardChanges = useCallback(() => {
      // Revert the permission to its original state
      if (editingOriginalPermission) {
        setUpdatedPermissions((prev) =>
          prev.map((p) =>
            p.id === editingOriginalPermission.id
              ? editingOriginalPermission
              : p,
          ),
        )
      }

      setEditingOriginalPermission(null)
      setSidePanel({ isOpen: false, title: '' })
      setShowUnsavedChangesModal(false)
      modalClose?.()
    }, [editingOriginalPermission, modalClose])

    const handleCancelDiscard = useCallback(() => {
      setShowUnsavedChangesModal(false)
      setSidePanel((prev) => ({ ...prev, isOpen: true }))
      modalClose?.()
    }, [modalClose])

    const columns = getPermissionsTableColumns({
      onRowConfigure: handleRowConfigure,
      onRowRevoke: handleRowRevoke,
    })

    useEffect(
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
        {updatedPermissions.length ? (
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
        >
          {sidePanel.type === 'configure' ? (
            sidePanel.selectedRow && (
              <PermissionsDetail
                permissions={sidePanel.selectedRow}
                onSubmit={handlePermissionSubmit}
                onUpdate={handlePermissionUpdate}
                channelsPanelOrder={2}
                onCancel={handleCancelClick}
              />
            )
          ) : (
            <>ERROR</>
          )}
        </SidePanel>
      </>
    )
  },
)
PermissionsTabContent.displayName = 'PermissionsTabContent'

export default PermissionsTabContent
