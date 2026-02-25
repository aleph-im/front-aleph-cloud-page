import React, { memo, useCallback, useMemo } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { PaymentType } from '@aleph-sdk/message'
import { ConfidentialsTabContentProps } from './types'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { Confidential } from '@/domain/confidential'
import { NAVIGATION_URLS } from '@/helpers/constants'
import DeprecatedResourceBanner from '@/components/common/DeprecatedResourceBanner'

export const ConfidentialsTabContent = memo(
  ({ data }: ConfidentialsTabContentProps) => {
    const router = useRouter()

    const legacyData = useMemo(() => {
      return data.filter((row) => row.payment?.type !== PaymentType.credit)
    }, [data])

    const handleRowClick = useCallback(
      (confidential: Confidential) => {
        router.push(`/console/computing/confidential/${confidential.id}`)
      },
      [router],
    )

    return (
      <>
        {legacyData.length > 0 && (
          <div tw="overflow-auto max-w-full">
            <EntityTable
              borderType="none"
              rowNoise
              rowKey={(row) => row.id}
              rowProps={(row) => ({
                onClick: () => handleRowClick(row),
              })}
              clickableRows
              data={legacyData}
              columns={[
                {
                  label: 'Name',
                  width: '100%',
                  sortable: true,
                  render: (row) =>
                    (row?.metadata?.name as string) || ellipseAddress(row.id),
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
                  label: 'HDD',
                  align: 'right',
                  sortable: true,
                  render: (row) => humanReadableSize(row.size, 'MiB'),
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
        )}
        <DeprecatedResourceBanner
          resourceName="TEE Instance"
          createUrl={NAVIGATION_URLS.creditConsole.computing.confidentials.new}
        />
      </>
    )
  },
)
ConfidentialsTabContent.displayName = 'ConfidentialsTabContent'

export default ConfidentialsTabContent
