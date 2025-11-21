import React, { useCallback } from 'react'
import tw from 'twin.macro'
import { WebsitesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'
import { NAVIGATION_URLS, PaymentMethod } from '@/helpers/constants'
import { Website } from '@/domain/website'
import ExternalLink from '@/components/common/ExternalLink'

export const WebsitesTabContent = React.memo(
  ({ data }: WebsitesTabContentProps) => {
    const isCredit = useCallback((row: Website) => {
      return row.payment?.type === PaymentMethod.Credit
    }, [])

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
                    render: (row) => row.id,
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
                        <Icon name="database" size="lg" />
                      </ButtonLink>
                    ),
                  },
                  {
                    label: 'Date',
                    align: 'right',
                    sortable: true,
                    render: (row) => row.updated_at,
                  },
                  {
                    label: '',
                    align: 'right',
                    render: (row) => {
                      const disabled = !isCredit(row)

                      return (
                        <ButtonLink
                          kind="functional"
                          variant="secondary"
                          href={`/console/hosting/website/${row.id}`}
                          disabled={disabled}
                          disabledMessage={
                            disabled && (
                              <p>
                                To manage this website, go to the{' '}
                                <ExternalLink
                                  text="Legacy console App."
                                  color="main0"
                                  href={
                                    NAVIGATION_URLS.legacyConsole.computing
                                      .instances.home
                                  }
                                />
                              </p>
                            )
                          }
                          tooltipPosition={{
                            my: 'bottom-right',
                            at: 'bottom-center',
                          }}
                        >
                          <Icon name="angle-right" size="lg" />
                        </ButtonLink>
                      )
                    },
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
                href={NAVIGATION_URLS.console.web3Hosting.website.new}
              >
                Create website
              </ButtonLink>
            </div> */}
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href={NAVIGATION_URLS.console.web3Hosting.website.new}
            >
              Create your first website
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
WebsitesTabContent.displayName = 'WebsitesTabContent'

export default WebsitesTabContent
