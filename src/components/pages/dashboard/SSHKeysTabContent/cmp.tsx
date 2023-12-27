import React from 'react'
import tw from 'twin.macro'
import { SSHKeysTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'

export const SSHKeysTabContent = React.memo(
  ({ data }: SSHKeysTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                rowKey={(row) => row.key}
                data={data}
                rowProps={(row) => ({
                  css: row.confirmed ? '' : tw`opacity-60`,
                })}
                columns={[
                  {
                    label: 'SSH Key',
                    sortable: true,
                    width: '100%',
                    render: (row) => row.key,
                    cellProps: () => ({
                      css: tw`max-w-0 whitespace-nowrap overflow-hidden text-ellipsis pr-3!`,
                    }),
                  },
                  {
                    label: 'Label',
                    sortable: true,
                    render: (row) => row.label || '',
                    cellProps: () => ({
                      css: tw`max-w-0 whitespace-nowrap overflow-hidden text-ellipsis px-3!`,
                    }),
                  },
                  {
                    label: '',
                    align: 'right',
                    render: (row) => (
                      <ButtonLink
                        color={row.confirmed ? 'main0' : 'main2'}
                        variant="tertiary"
                        href={`/dashboard/manage?hash=${row.id}`}
                      >
                        &gt;
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
              <ButtonLink variant="primary" href="/dashboard/ssh">
                Create ssh key
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/dashboard/ssh">
              Create your first ssh key
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
SSHKeysTabContent.displayName = 'SSHKeysTabContent'

export default SSHKeysTabContent
