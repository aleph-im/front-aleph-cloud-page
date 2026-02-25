import React, { memo, useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { PaymentType } from '@aleph-sdk/message'
import { ConfidentialsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { Confidential } from '@/domain/confidential'
import ExternalLink from '@/components/common/ExternalLink'
import { NAVIGATION_URLS } from '@/helpers/constants'

const CreateConfidentialButton = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <ButtonLink
    variant="primary"
    href="https://docs.aleph.im/computing/confidential/"
    target="_blank"
  >
    {children}
  </ButtonLink>
)
CreateConfidentialButton.displayName = 'CreateConfidentialButton'

export const ConfidentialsTabContent = memo(
  ({ data }: ConfidentialsTabContentProps) => {
    const isCredit = useCallback((row: Confidential) => {
      return row.payment?.type === PaymentType.credit
    }, [])

    const router = useRouter()

    const handleRowClick = useCallback(
      (confidential: Confidential) => {
        if (!isCredit(confidential)) return

        router.push(`/console/computing/confidential/${confidential.id}`)
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
                      To manage this TEE instance, go to the{' '}
                      <ExternalLink
                        text="Legacy console App."
                        color="main0"
                        href={
                          NAVIGATION_URLS.legacyConsole.computing.confidentials
                            .home
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
                          href={NAVIGATION_URLS.legacyConsole.computing.confidentials.detail(
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
              <CreateConfidentialButtonMemo>
                Create TEE instance
              </CreateConfidentialButtonMemo>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <CreateConfidentialButtonMemo>
              Create your first TEE instance
            </CreateConfidentialButtonMemo>
          </div>
        )}
      </>
    )
  },
)
ConfidentialsTabContent.displayName = 'ConfidentialsTabContent'

const CreateConfidentialButtonMemo = memo(
  CreateConfidentialButton,
) as typeof CreateConfidentialButton

export default ConfidentialsTabContent
