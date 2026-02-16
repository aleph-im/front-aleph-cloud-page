import React, { memo, useCallback, useRef, useState, useEffect } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { PaymentType } from '@aleph-sdk/message'
import { VolumesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { ellipseAddress, humanReadableSize } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon, Tooltip } from '@aleph-front/core'
import { NAVIGATION_URLS } from '@/helpers/constants'
import { Volume } from '@/domain/volume'

const LegacyVolumeButton = ({ volume }: { volume: Volume }) => {
  const [renderTooltip, setRenderTooltip] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRenderTooltip(true)
  }, [])

  return (
    <div ref={containerRef} className="inline-flex relative">
      <ButtonLink
        kind="functional"
        variant="secondary"
        href={`${NAVIGATION_URLS.legacyConsole.storage.volumes.home}/${volume.id}`}
        target="_blank"
      >
        <Icon name="arrow-up-right-from-square" size="lg" />
      </ButtonLink>
      {renderTooltip && (
        <Tooltip
          my="bottom-right"
          at="top-right"
          targetRef={containerRef}
          content={
            <p>
              This volume was created with holding tier. Click to manage it in
              the Legacy console App.
            </p>
          }
        />
      )}
    </div>
  )
}

export const VolumesTabContent = ({
  data,
  cta = true,
}: VolumesTabContentProps) => {
  const router = useRouter()

  const isCredit = useCallback((row: Volume) => {
    const payment = (row as Volume & { payment?: { type: PaymentType } })
      .payment
    return payment?.type === PaymentType.credit
  }, [])

  const handleRowClick = useCallback(
    (volume: Volume) => {
      if (!isCredit(volume)) return

      router.push(
        `${NAVIGATION_URLS.console.storage.volumes.home}/${volume.id}`,
      )
    },
    [isCredit, router],
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
            css: isCredit(row) ? (row.confirmed ? '' : tw`opacity-60`) : '',
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
              render: (row) => {
                if (isCredit(row)) {
                  return (
                    <Button
                      kind="functional"
                      variant="secondary"
                      onClick={() => handleRowClick(row)}
                    >
                      <Icon name="angle-right" size="lg" />
                    </Button>
                  )
                }

                return <LegacyVolumeButton volume={row} />
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
