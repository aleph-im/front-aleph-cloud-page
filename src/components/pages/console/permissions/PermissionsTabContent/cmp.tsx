import React from 'react'
import { PermissionsTabContentProps } from './types'
import { getPermissionsTableColumns } from './columns'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { AccountPermissions } from '@/domain/permissions'
import SidePanel from '@/components/common/SidePanel'
import PermissionsDetail from '@/components/common/PermissionsDetail'
import { Button } from '@aleph-front/core'

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
    const [isFormDirty, setIsFormDirty] = React.useState(false)

    const handleRowConfigure = (row: AccountPermissions) => {
      console.log('Configure permission:', row)
      setSidePanel({
        isOpen: true,
        title: 'Permissions',
        type: 'configure',
        selectedRow: row,
      })
    }

    const handleRowRevoke = (row: AccountPermissions) => {
      console.log('Revoke permission:', row)
    }

    const handleRowClick = (row: AccountPermissions, index: number) => {
      console.log(`row click ${index}`)
      setSidePanel({
        isOpen: true,
        title: 'Permissions',
        type: 'configure',
        selectedRow: row,
      })
    }

    const handlePermissionSubmit = React.useCallback(
      (updatedPermission: AccountPermissions) => {
        onPermissionChange?.(updatedPermission)
        setSidePanel((prev) => ({ ...prev, isOpen: false }))
      },
      [onPermissionChange],
    )

    const columns = getPermissionsTableColumns({
      onRowConfigure: handleRowConfigure,
      onRowRevoke: handleRowRevoke,
    })

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
                data={data}
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
          onClose={() => {
            setSidePanel((prev) => ({ ...prev, isOpen: false }))
          }}
          title={sidePanel.title}
          footer={
            isFormDirty &&
            sidePanel.type === 'configure' &&
            sidePanel.selectedRow && (
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
                  onClick={() => {
                    setSidePanel((prev) => ({ ...prev, isOpen: false }))
                  }}
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
                renderFooter={() => null}
                onDirtyChange={setIsFormDirty}
                onSubmitSuccess={handlePermissionSubmit}
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
