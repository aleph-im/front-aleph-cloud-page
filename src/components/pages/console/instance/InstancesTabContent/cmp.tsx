import React, { useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { PaymentType } from '@aleph-sdk/message'
import { InstancesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { Instance } from '@/domain/instance'
import ExternalLink from '@/components/common/ExternalLink'
import { NAVIGATION_URLS } from '@/helpers/constants'

export const InstancesTabContent = React.memo(
  ({ data }: InstancesTabContentProps) => {
    const isCredit = useCallback((row: Instance) => {
      return row.payment?.type === PaymentType.credit
    }, [])

    const router = useRouter()

    const handleRowClick = useCallback(
      (instance: Instance) => {
        if (!isCredit(instance)) return

        router.push(`/console/computing/instance/${instance.id}`)
      },
      [isCredit, router],
    )

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
                  css: isCredit(row) ? '' : tw`opacity-40 cursor-not-allowed!`,
                  onClick: () => handleRowClick(row),
                })}
                rowTooltip={(row) => {
                  if (isCredit(row)) return null

                  return (
                    <p>
                      To manage this instance, go to the{' '}
                      <ExternalLink
                        text="Legacy console App."
                        color="main0"
                        href={
                          NAVIGATION_URLS.legacyConsole.computing.instances.home
                        }
                      />
                    </p>
                  )
                }}
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
                    label: 'date',
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

                      return (
                        <a
                          href={NAVIGATION_URLS.legacyConsole.computing.instances.detail(
                            row.id,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button kind="functional" variant="secondary">
                            <Icon name="external-link" size="lg" />
                          </Button>
                        </a>
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
