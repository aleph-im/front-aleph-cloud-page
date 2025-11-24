import React from 'react'
import tw from 'twin.macro'
import { PermissionsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { ellipseAddress } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'
import { CopytoClipboardIcon } from '@/components/common/CopyToClipboardIcon/cmp'

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
                rowKey={({ address }) => address}
                data={data}
                columns={[
                  {
                    label: 'Address',
                    sortable: true,
                    render: ({ alias }) => alias || '-',
                  },
                  {
                    label: 'Alias',
                    sortable: true,
                    render: ({ address }) => {
                      return (
                        <>
                          {ellipseAddress(address)}{' '}
                          <CopytoClipboardIcon text={address} />
                        </>
                      )
                    },
                  },
                  {
                    label: 'Channels',
                    render: ({ channels }) => {
                      if (!channels?.length) return 'All'

                      return channels?.join(', ')
                    },
                  },
                  {
                    label: 'Permissions',
                    sortable: true,
                    render: ({ types }) => types?.join(', '),
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
