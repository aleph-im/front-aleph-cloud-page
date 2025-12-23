import React, { useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { GpuInstancesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { PaymentType } from '@aleph-sdk/message'
import { Button, Icon } from '@aleph-front/core'
import { GpuInstance } from '@/domain/gpuInstance'

export const GpuInstancesTabContent = React.memo(
  ({ data }: GpuInstancesTabContentProps) => {
    const router = useRouter()
    const handleRowClick = useCallback(
      (gpuInstance: GpuInstance) => {
        router.push(`/console/computing/gpu-instance/${gpuInstance.id}`)
      },
      [router],
    )

    const isCredit = useCallback((row: GpuInstance) => {
      return row.payment?.type === PaymentType.credit
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
                rowProps={(row) => ({
                  css: isCredit(row) ? '' : tw`opacity-40`,
                  onClick: () => handleRowClick(row),
                })}
                clickableRows
                data={data}
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
                    render: (row) => {
                      const disabled = !isCredit(row)

                      return (
                        <Button
                          kind="functional"
                          variant="secondary"
                          onClick={() => handleRowClick(row)}
                          disabled={disabled}
                        >
                          <Icon name="angle-right" size="lg" />
                        </Button>
                      )
                    },
                    cellProps: () => ({
                      css: tw`pl-3!`,
                    }),
                  },
                ]}
              />
            </div>

            <div tw="mt-20 text-center">
              <ButtonLink
                variant="primary"
                href="/console/computing/gpu-instance/new"
              >
                Create GPU instance
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href="/console/computing/gpu-instance/new"
            >
              Create your first GPU instance
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
GpuInstancesTabContent.displayName = 'GpuInstancesTabContent'

export default GpuInstancesTabContent
