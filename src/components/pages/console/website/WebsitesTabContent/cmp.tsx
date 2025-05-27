import React from 'react'
import tw from 'twin.macro'
import { WebsitesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Icon, NoisyContainer } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'

export const WebsitesTabContent = React.memo(
  ({ data }: WebsitesTabContentProps) => {
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
                      render: (row) => (
                        <ButtonLink
                          kind="functional"
                          variant="secondary"
                          href={`/console/hosting/website/${row.id}`}
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
                href={NAVIGATION_URLS.console.web3Hosting.website.new}
              >
                Create website
              </ButtonLink>
            </div>
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
