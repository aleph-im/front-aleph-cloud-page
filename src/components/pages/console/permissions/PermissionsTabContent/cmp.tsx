import React from 'react'
import { PermissionsTabContentProps } from './types'
import { getPermissionsTableColumns } from './columns'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Permission } from '@/domain/permissions'
import SidePanel from '@/components/common/SidePanel'
import PermissionsDetail from '@/components/common/PermissionsDetail'

// Type for side panel content
type SidePanelContent = {
  isOpen: boolean
  title: string
  type?: 'configure'
  selectedRow?: Permission
}

export const PermissionsTabContent = React.memo(
  ({ data }: PermissionsTabContentProps) => {
    const [sidePanel, setSidePanel] = React.useState<SidePanelContent>({
      isOpen: false,
      title: '',
    })

    const handleRowConfigure = (row: Permission) => {
      console.log('Configure permission:', row)
      setSidePanel({
        isOpen: true,
        title: 'Permissions',
        type: 'configure',
        selectedRow: row,
      })
    }

    const handleRowRevoke = (row: Permission) => {
      console.log('Revoke permission:', row)
    }

    const handleRowClick = (row: Permission, index: number) => {
      console.log(`row click ${index}`)
      setSidePanel({
        isOpen: true,
        title: 'Permissions',
        type: 'configure',
        selectedRow: row,
      })
    }

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
                rowKey={({ address }: Permission) => address}
                data={data}
                columns={columns}
                rowProps={(row: Permission, i: number) => ({
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
        >
          {sidePanel.type === 'configure' ? (
            sidePanel.selectedRow && (
              <PermissionsDetail permissions={sidePanel.selectedRow} />
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
