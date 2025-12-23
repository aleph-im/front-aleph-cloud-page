import React, { memo, useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { VolumesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { ellipseAddress, humanReadableSize } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'
import { Volume } from '@/domain/volume'

export const VolumesTabContent = ({
  data,
  cta = true,
}: VolumesTabContentProps) => {
  const router = useRouter()
  const handleRowClick = useCallback(
    (volume: Volume) => {
      router.push(
        `${NAVIGATION_URLS.console.storage.volumes.home}/${volume.id}`,
      )
    },
    [router],
  )
  return (
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
            onClick: () => handleRowClick(row),
          })}
          clickableRows
          columns={[
            {
              label: 'Name',
              width: '100%',
              sortable: true,
              render: (row) => ellipseAddress(row.id || ''),
            },
            {
              label: 'Size',
              align: 'right',
              sortable: true,
              render: (row) => humanReadableSize(row.size || 0, 'MiB'),
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
                  disabled
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
      {cta && (
        <div tw="mt-10 text-center">
          <ButtonLink
            variant="primary"
            href={NAVIGATION_URLS.console.storage.volumes.new}
          >
            <Icon name="plus-circle" size="lg" tw="mr-1" /> Create new volume
          </ButtonLink>
        </div>
      )}
    </>
  )
}
VolumesTabContent.displayName = 'VolumesTabContent'

export default memo(VolumesTabContent) as typeof VolumesTabContent
