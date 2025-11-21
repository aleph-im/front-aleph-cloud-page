import React from 'react'
import tw from 'twin.macro'
import { PermissionsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { ellipseAddress } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'

export const PermissionsTabContent = React.memo(
  ({ data }: PermissionsTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                rowKey={(row) => row.address}
                data={data}
                columns={[
                  {
                    label: 'Address',
                    sortable: true,
                    render: (row) => ellipseAddress(row.address),
                  },
                  {
                    label: 'Types',
                    sortable: true,
                    render: (row) => row.types?.join(', '),
                  },
                  {
                    label: 'Channels',
                    render: (row) => row.channels?.join(', '),
                  },
                  {
                    label: '',
                    width: '100%',
                    align: 'right',
                    render: (row) => (
                      <ButtonLink
                        kind="functional"
                        variant="secondary"
                        href={`#`}
                      >
                        <Icon name="angle-right" size="lg" />
                      </ButtonLink>
                    ),
                    cellProps: () => ({
                      css: tw`pl-3!`,
                    }),
                  },
                ]}
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
