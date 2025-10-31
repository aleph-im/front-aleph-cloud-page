import React from 'react'
import tw from 'twin.macro'
import { FunctionsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { convertByteUnits, ellipseAddress } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'
import ExternalLink from '@/components/common/ExternalLink'

export const FunctionsTabContent = React.memo(
  ({ data }: FunctionsTabContentProps) => {
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                rowProps={(row) => ({
                  // css: row.confirmed ? '' : tw`opacity-60`,
                  css: tw`opacity-40`,
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
                        href={`${NAVIGATION_URLS.console.computing.functions.home}/${row.id}`}
                        disabled={true}
                        disabledMessage={
                          <p>
                            To manage this function, go to the{' '}
                            <ExternalLink
                              text="Legacy console App."
                              color="main0"
                              href={
                                NAVIGATION_URLS.legacyConsole.computing
                                  .instances.home
                              }
                            />
                          </p>
                        }
                        tooltipPosition={{
                          my: 'bottom-right',
                          at: 'bottom-center',
                        }}
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
            {/* <div tw="mt-20 text-center">
              <ButtonLink
                variant="primary"
                href={NAVIGATION_URLS.console.computing.functions.new}
              >
                Create function
              </ButtonLink>
            </div> */}
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
