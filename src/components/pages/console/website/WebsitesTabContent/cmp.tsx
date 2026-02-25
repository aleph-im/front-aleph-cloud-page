import React, { useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { WebsitesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'
import { Website } from '@/domain/website'
import DeprecatedResourceBanner from '@/components/common/DeprecatedResourceBanner'

export const WebsitesTabContent = React.memo(
  ({ data }: WebsitesTabContentProps) => {
    const router = useRouter()
    const handleRowClick = useCallback(
      (website: Website) => {
        router.push(`/console/hosting/website/${website.id}`)
      },
      [router],
    )

    return (
      <>
        {data.length > 0 && (
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
        )}
        <DeprecatedResourceBanner
          resourceName="Website"
          createUrl={NAVIGATION_URLS.creditConsole.hosting.websites.new}
        />
      </>
    )
  },
)
WebsitesTabContent.displayName = 'WebsitesTabContent'

export default WebsitesTabContent
