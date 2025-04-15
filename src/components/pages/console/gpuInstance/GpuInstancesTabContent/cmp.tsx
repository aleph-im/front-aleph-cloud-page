import React from 'react'
import tw from 'twin.macro'
import { GpuInstancesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon, NoisyContainer } from '@aleph-front/core'

export const GpuInstancesTabContent = React.memo(
  ({ data }: GpuInstancesTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <NoisyContainer>
              <div tw="overflow-auto max-w-full">
                <EntityTable
                  borderType="none"
                  rowNoise
                  rowKey={(row) => row.id}
                  data={data}
                  columns={[
                    {
                      label: 'Name',
                      width: '100%',
                      sortable: true,
                      render: (row) =>
                        (row?.metadata?.name as string) ||
                        ellipseAddress(row.id),
                    },
                    {
                      label: 'Cores',
                      align: 'right',
                      sortable: true,
                      render: (row) => row?.resources?.vcpus || 0,
                    },
                    {
                      label: 'RAM',
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
                      label: 'HDD',
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
                      align: 'right',
                      render: (row) => (
                        <ButtonLink
                          kind="functional"
                          variant="secondary"
                          href={`/console/computing/gpu-instance/${row.id}`}
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
            </NoisyContainer>

            <div tw="mt-20 text-center">
              <ButtonLink
                variant="primary"
                href="/console/computing/gpu-instance/new"
              >
                Create GPU instance
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href="/console/computing/gpu-instance/new"
            >
              Create your first GPU instance
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
GpuInstancesTabContent.displayName = 'GpuInstancesTabContent'

export default GpuInstancesTabContent
