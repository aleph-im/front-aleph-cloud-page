import React from 'react'
import tw from 'twin.macro'
import { InstancesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'
import ExternalLink from '@/components/common/ExternalLink'
import { PaymentType } from '@aleph-sdk/message'
import { NAVIGATION_URLS } from '@/helpers/constants'

export const InstancesTabContent = React.memo(
  ({ data }: InstancesTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                rowKey={(row) => row.id}
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
                      const isCredit = row.payment?.type === PaymentType.credit

                      return (
                        <ButtonLink
                          kind="functional"
                          variant="secondary"
                          href={`/console/computing/instance/${row.id}`}
                          disabled={isCredit}
                          disabledMessage={
                            isCredit && (
                              <p>
                                To manage this instance, go to the{' '}
                                <ExternalLink
                                  text="New Credit Console."
                                  color="main0"
                                  href={
                                    NAVIGATION_URLS.newConsole.computing
                                      .instances.home
                                  }
                                />
                              </p>
                            )
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

            <div tw="mt-20 text-center">
              <ButtonLink
                variant="primary"
                href="/console/computing/instance/new"
              >
                Create instance
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href="/console/computing/instance/new"
            >
              Create your first instance
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
InstancesTabContent.displayName = 'InstancesTabContent'

export default InstancesTabContent
