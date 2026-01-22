import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import PermissionsDetail from '@/components/common/PermissionsDetail'
import SidePanel from '@/components/common/SidePanel'
import { AccountPermissions } from '@/domain/permissions'
import { Button, Icon, Modal, TextGradient } from '@aleph-front/core'
import { memo, useCallback, useEffect, useState } from 'react'
import { getPermissionsTableColumns } from './columns'
import { PermissionsTabContentProps } from './types'
import { NAVIGATION_URLS } from '@/helpers/constants'

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
      // Set revoked to true for this permission
      const updatedPermission = { ...row, revoked: true }
      setUpdatedPermissions((prev) =>
        prev.map((p) => (p.id === row.id ? updatedPermission : p)),
      )
      // Notify parent component of the change
      onPermissionChange?.(updatedPermission)
    }

    const handleRowRestore = (row: AccountPermissions) => {
      // Set revoked to false for this permission
      const updatedPermission = { ...row, revoked: false }
      setUpdatedPermissions((prev) =>
        prev.map((p) => (p.id === row.id ? updatedPermission : p)),
      )
      // Notify parent component of the change
      onPermissionChange?.(updatedPermission)
    }

    const handleRowClick = (row: AccountPermissions) => {
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
    }, [editingOriginalPermission])

    const handleCancelDiscard = useCallback(() => {
      setShowUnsavedChangesModal(false)
      setSidePanel((prev) => ({ ...prev, isOpen: true }))
    }, [])

    const columns = getPermissionsTableColumns({
      onRowConfigure: handleRowConfigure,
      onRowRevoke: handleRowRevoke,
      onRowRestore: handleRowRestore,
    })

    const permissionsDetailFooter = sidePanel.selectedRow ? (
      <div tw="flex justify-start gap-x-4">
        <Button
          type="submit"
          form="permissions-detail-form"
          color="main0"
          kind="functional"
          variant="warning"
        >
          <Icon name="arrow-left" />
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
    ) : null

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
                rowProps={(row: AccountPermissions) => ({
                  onClick: () => {
                    !row.revoked && handleRowClick(row)
                  },
                })}
              />
            </div>

            <div tw="mt-20 text-center">
              <ButtonLink
                variant="primary"
                href={NAVIGATION_URLS.console.permissions.new}
              >
                Create permissions
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href={NAVIGATION_URLS.console.permissions.new}
            >
              Create permissions
            </ButtonLink>
          </div>
        )}
        <SidePanel
          isOpen={sidePanel.isOpen}
          onClose={handleClosePanel}
          title={sidePanel.title}
          footer={permissionsDetailFooter}
        >
          {sidePanel.type === 'configure' ? (
            sidePanel.selectedRow && (
              <PermissionsDetail
                permissions={sidePanel.selectedRow}
                onSubmit={handlePermissionSubmit}
                onUpdate={handlePermissionUpdate}
                channelsPanelOrder={2}
              />
            )
          ) : (
            <>ERROR</>
          )}
        </SidePanel>

        {/* Unsaved Changes Modal */}
        <Modal
          open={showUnsavedChangesModal}
          onClose={handleCancelDiscard}
          width="34rem"
          header={<TextGradient type="h6">Unsaved Changes</TextGradient>}
          content={
            <div tw="mb-8">
              <p className="tp-body">
                You&apos;ve made updates to your permission settings.
              </p>
              <p className="tp-body">
                If you leave now, these changes won&apos;t be saved.
              </p>
            </div>
          }
          footer={
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
          }
        />
      </>
    )
  },
)
PermissionsTabContent.displayName = 'PermissionsTabContent'

export default PermissionsTabContent
