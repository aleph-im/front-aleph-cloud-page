import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import PermissionsDetail from '@/components/common/PermissionsDetail'
import SidePanel from '@/components/common/SidePanel'
import { AccountPermissions } from '@/domain/permissions'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  TextGradient,
  TextInput,
  useModal,
} from '@aleph-front/core'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { getPermissionsTableColumns } from './columns'
import { PermissionsTabContentProps } from './types'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { useChannels } from '@/hooks/common/useChannels'

const StyledFooter = styled.div`
  ${({ theme }) => css`
    ${tw`sticky bottom-0 left-0 right-0 p-6`}

    background: ${theme.color.background}D5;
    animation: slideUp ${theme.transition.duration.normal}ms
      ${theme.transition.timing} forwards;

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `}
`

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

    const [isChannelsPanelOpen, setIsChannelsPanelOpen] = useState(false)

    const [showUnsavedChangesModal, setShowUnsavedChangesModal] =
      useState(false)

    const [channelsSearchQuery, setChannelsSearchQuery] = useState('')
    const [selectedChannels, setSelectedChannels] = useState<string[]>([])

    // State to track pending changes in permissions
    const [updatedPermissions, setUpdatedPermissions] =
      useState<AccountPermissions[]>(data)

    // Track currently editing permission to detect unsaved changes
    const [editingOriginalPermission, setEditingOriginalPermission] =
      useState<AccountPermissions | null>(null)

    const modal = useModal()
    const modalOpen = modal?.open
    const modalClose = modal?.close

    // Get currently editing permission's address for fetching channels
    const currentEditingAddress = sidePanel.selectedRow?.id

    const { channels: availableChannels, isLoading: isLoadingChannels } =
      useChannels(currentEditingAddress)

    // Sync with data prop changes
    useEffect(() => {
      setUpdatedPermissions(data)
    }, [data])

    // Initialize selected channels when channels panel opens
    useEffect(() => {
      if (isChannelsPanelOpen && sidePanel.selectedRow) {
        setSelectedChannels(sidePanel.selectedRow.channels)
      }
    }, [isChannelsPanelOpen, sidePanel.selectedRow])

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

    const filteredChannels = useMemo(() => {
      if (!channelsSearchQuery) return availableChannels
      return availableChannels.filter((channel) =>
        channel.toLowerCase().includes(channelsSearchQuery.toLowerCase()),
      )
    }, [availableChannels, channelsSearchQuery])

    const handleToggleChannel = useCallback((channel: string) => {
      setSelectedChannels((prev) =>
        prev.includes(channel)
          ? prev.filter((c) => c !== channel)
          : [...prev, channel],
      )
    }, [])

    const handleClearAllChannels = useCallback(() => {
      setSelectedChannels([])
    }, [])

    const handleSelectAllChannels = useCallback(() => {
      setSelectedChannels([...availableChannels])
    }, [availableChannels])

    const handleApplyChannels = useCallback(() => {
      if (sidePanel.selectedRow) {
        const updatedPermission: AccountPermissions = {
          ...sidePanel.selectedRow,
          channels: selectedChannels,
        }
        handlePermissionUpdate(updatedPermission)
        setIsChannelsPanelOpen(false)
        setChannelsSearchQuery('')
      }
    }, [sidePanel.selectedRow, selectedChannels, handlePermissionUpdate])

    const handleCancelChannels = useCallback(() => {
      setIsChannelsPanelOpen(false)
      setChannelsSearchQuery('')
      if (sidePanel.selectedRow) {
        setSelectedChannels(sidePanel.selectedRow.channels)
      }
    }, [sidePanel.selectedRow])

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
                onOpenChannelsPanel={() => setIsChannelsPanelOpen(true)}
                onCancel={handleCancelClick}
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
          <div tw="flex flex-col gap-y-2.5">
            <div className="tp-info fs-14">Permissions details</div>
            <NoisyContainer>
              <TextInput
                name="channels-search"
                placeholder="Search"
                icon={<Icon name="search" />}
                value={channelsSearchQuery}
                onChange={(e) => setChannelsSearchQuery(e.target.value)}
              />
              <div tw="flex items-center justify-between w-full my-3">
                <Button variant="textOnly" onClick={handleSelectAllChannels}>
                  Select all
                </Button>
                <Button variant="textOnly" onClick={handleClearAllChannels}>
                  Clear all
                </Button>
              </div>
              <div tw="flex flex-col gap-y-3 max-h-52 overflow-y-auto">
                {isLoadingChannels ? (
                  <div className="tp-info fs-12">Loading...</div>
                ) : filteredChannels.length > 0 ? (
                  filteredChannels.map((channel) => (
                    <div key={channel} tw="flex items-center gap-x-2.5">
                      <Checkbox
                        checked={selectedChannels.includes(channel)}
                        onChange={() => handleToggleChannel(channel)}
                        size="sm"
                      />
                      <span className="fs-12">{channel}</span>
                    </div>
                  ))
                ) : (
                  <div className="tp-info fs-12">
                    {channelsSearchQuery
                      ? 'No matches found'
                      : 'No channels available'}
                  </div>
                )}
              </div>
            </NoisyContainer>
          </div>
          <StyledFooter>
            <div tw="flex justify-start gap-x-4">
              <Button
                type="button"
                color="main0"
                kind="functional"
                variant="warning"
                onClick={handleApplyChannels}
              >
                Continue
              </Button>
              <button
                type="button"
                onClick={handleCancelChannels}
                className="tp-header fs-14"
                tw="not-italic font-bold"
              >
                Cancel
              </button>
            </div>
          </StyledFooter>
        </SidePanel>
      </>
    )
  },
)
PermissionsTabContent.displayName = 'PermissionsTabContent'

export default PermissionsTabContent
