import React from 'react'
import tw from 'twin.macro'
import { WebsitesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Icon, NoisyContainer } from '@aleph-front/core'

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
                      label: 'Size',
                      align: 'right',
                      sortable: true,
                      render: (row) => (
                        <ButtonLink
                          kind="functional"
                          variant="none"
                          size="sm"
                          href={`/storage/volume/${row.volume_id}`}
                        >
                          <Icon name="chain" size="lg" />
                        </ButtonLink>
                      ),
                      //humanReadableSize(row.volume?.size ?? 0, 'MiB'),
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
                          href={`/hosting/website/${row.id}`}
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
              <ButtonLink variant="primary" href="/hosting/website/new">
                Create website
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/hosting/website/new">
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
