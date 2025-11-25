import React from 'react'
import { PermissionsTabContentProps } from './types'
import { getPermissionsTableColumns } from './columns'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Permission } from '@/domain/permissions'

export const PermissionsTabContent = React.memo(
  ({ data }: PermissionsTabContentProps) => {
    const handleRowConfigure = (row: Permission) => {
      console.log('Configure permission:', row)
    }

    const handleRowRevoke = (row: Permission) => {
      console.log('Revoke permission:', row)
    }

    const handleRowClick = (row: Permission, index: number) => {
      alert(`row click ${index}`)
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
      </>
    )
  },
)
PermissionsTabContent.displayName = 'PermissionsTabContent'

export default PermissionsTabContent
