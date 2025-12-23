import React, { useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { FunctionsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { convertByteUnits, ellipseAddress } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'
import { Program } from '@/domain/program'

export const FunctionsTabContent = React.memo(
  ({ data }: FunctionsTabContentProps) => {
    const router = useRouter()
    const handleRowClick = useCallback(
      (program: Program) => {
        router.push(
          `${NAVIGATION_URLS.console.computing.functions.home}/${program.id}`,
        )
      },
      [router],
    )
    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                rowKey={(row) => row.id}
                data={data}
                rowProps={(row) => ({
                  onClick: () => handleRowClick(row),
                  css: row.confirmed ? '' : tw`opacity-60`,
                })}
                clickableRows
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
                      <Button
                        kind="functional"
                        variant="secondary"
                        onClick={() => handleRowClick(row)}
                      >
                        <Icon name="angle-right" size="lg" />
                      </Button>
                    ),
                    cellProps: () => ({
                      css: tw`pl-3!`,
                    }),
                  },
                ]}
              />
            </div>
            <div tw="mt-20 text-center">
              <ButtonLink
                variant="primary"
                href={NAVIGATION_URLS.console.computing.functions.new}
              >
                Create function
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href={NAVIGATION_URLS.console.computing.functions.new}
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
