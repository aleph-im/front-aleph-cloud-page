import React from 'react'
import tw from 'twin.macro'
import { FunctionsTabContentProps } from './types'
import { Table } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertBitUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export const FunctionsTabContent = React.memo(
  ({ data }: FunctionsTabContentProps) => {
    const theme = useTheme()

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
                      row?.metadata?.name || ellipseAddress(row.id),
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
                      convertBitUnits(row?.resources?.memory || 0, {
                        from: 'mb',
                        to: 'gb',
                      }),
                  },
                  {
                    label: 'Size',
                    align: 'right',
                    sortable: true,
                    render: (row) => humanReadableSize(row.size, 'mb'),
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
                        href={`/dashboard/manage?hash=${row.id}`}
                      >
                        {row.confirmed ? (
                          <>&gt;</>
                        ) : (
                          <>
                            <RotatingLines
                              strokeColor={theme.color.main2}
                              animationDuration="1"
                              width="1em"
                            />
                          </>
                        )}
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
              <ButtonLink variant="primary" href="/dashboard/function">
                Create function
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/dashboard/function">
              Create your first function
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
FunctionsTabContent.displayName = 'FunctionsTabContent'

export default FunctionsTabContent
