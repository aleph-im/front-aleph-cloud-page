import React, { memo } from 'react'
import tw from 'twin.macro'
import { VolumesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { ellipseAddress, humanReadableSize } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon, NoisyContainer } from '@aleph-front/core'

export const VolumesTabContent = ({ data }: VolumesTabContentProps) => {
  return (
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
                  <ButtonLink
                    kind="functional"
                    variant="secondary"
                    href={`/storage/volume/${row.id}`}
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
      <div tw="mt-10 text-center">
        <ButtonLink variant="primary" href="/storage/volume/new">
          <Icon name="plus-circle" size="lg" tw="mr-1" /> Create new volume
        </ButtonLink>
      </div>
    </>
  )
}
VolumesTabContent.displayName = 'VolumesTabContent'

export default memo(VolumesTabContent) as typeof VolumesTabContent
