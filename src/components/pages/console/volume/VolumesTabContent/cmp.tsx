import React, { memo, useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { VolumesTabContentProps } from './types'
import { ellipseAddress, humanReadableSize } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'
import { Volume } from '@/domain/volume'
import DeprecatedResourceBanner from '@/components/common/DeprecatedResourceBanner'

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
        <DeprecatedResourceBanner
          resourceName="Volume"
          createUrl={NAVIGATION_URLS.creditConsole.storage.volumes.new}
        />
      )}
    </>
  )
}
VolumesTabContent.displayName = 'VolumesTabContent'

export default memo(VolumesTabContent) as typeof VolumesTabContent
