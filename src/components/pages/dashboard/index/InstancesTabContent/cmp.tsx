import React from 'react'
import tw from 'twin.macro'
import { InstancesTabContentProps } from './types'
import { Table } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'

export const InstancesTabContent = React.memo(
  ({ data }: InstancesTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <Table
                borderType="none"
                oddRowNoise
                rowKey={(row) => row.id}
                data={data}
                rowProps={(row) => ({
                  css: row.confirmed ? '' : tw`opacity-60`,
                })}
                columns={[
                  {
                    label: 'Name',
                    width: '50%',
                    sortable: true,
                    render: (row) =>
                      (row?.metadata?.name as string) || ellipseAddress(row.id),
                  },
                  {
                    label: 'Cores',
                    align: 'right',
                    sortable: true,
                    render: (row) => row?.resources?.vcpus || 0,
                  },
                  {
                    label: 'Memory',
                    align: 'right',
                    sortable: true,
                    render: (row) =>
                      convertByteUnits(row?.resources?.memory || 0, {
                        from: 'MiB',
                        to: 'GiB',
                        displayUnit: true,
                      }),
                  },
                  {
                    label: 'Size',
                    align: 'right',
                    sortable: true,
                    render: (row) => humanReadableSize(row.size, 'MiB'),
                  },
                  {
                    label: 'Date',
                    align: 'right',
                    sortable: true,
                    render: (row) => row.date,
                  },
                  {
                    label: '',
                    width: '0',
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
              <ButtonLink variant="primary" href="/dashboard/instance">
                Create instance
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/dashboard/instance">
              Create your first instance
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
InstancesTabContent.displayName = 'InstancesTabContent'

export default InstancesTabContent
