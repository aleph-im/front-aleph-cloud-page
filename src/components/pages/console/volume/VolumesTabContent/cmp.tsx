import React, { memo } from 'react'
import tw from 'twin.macro'
import { VolumesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { ellipseAddress, humanReadableSize } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'
import ExternalLink from '@/components/common/ExternalLink'

export const VolumesTabContent = ({
  data,
  cta = true,
}: VolumesTabContentProps) => {
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
              render: (row) => {
                return (
                  <ButtonLink
                    kind="functional"
                    variant="secondary"
                    href={`${NAVIGATION_URLS.console.storage.volumes.home}/${row.id}`}
                    disabled={true}
                    disabledMessage={
                      <p>
                        To manage this volume, go to the{' '}
                        <ExternalLink
                          text="Legacy console App."
                          color="main0"
                          href={
                            NAVIGATION_URLS.legacyConsole.computing.instances
                              .home
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
                )
              },
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
