import React from 'react'
import tw from 'twin.macro'
import { FunctionsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { convertByteUnits, ellipseAddress } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon, NoisyContainer } from '@aleph-front/core'

export const FunctionsTabContent = React.memo(
  ({ data }: FunctionsTabContentProps) => {
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
                  rowProps={(row) => ({
                    css: row.confirmed ? '' : tw`opacity-60`,
                  })}
                  columns={[
                    {
                      label: 'Name',
                      width: '100%',
                      sortable: true,
                      render: (row) => (
                        <>{row?.metadata?.name || ellipseAddress(row.id)}</>
                      ),
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
                      label: 'Volume',
                      align: 'right',
                      sortable: true,
                      render: (row) => (
                        <ButtonLink
                          kind="functional"
                          variant="none"
                          size="sm"
                          href={row.refUrl}
                        >
                          <Icon name="file-code" size="lg" />
                        </ButtonLink>
                      ),
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
                          href={`/console/computing/function/${row.id}`}
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
                href="/console/computing/function/new"
              >
                Create function
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href="/console/computing/function/new"
            >
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
