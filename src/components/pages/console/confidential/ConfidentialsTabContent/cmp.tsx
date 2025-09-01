import React, { memo } from 'react'
import tw from 'twin.macro'
import { ConfidentialsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseAddress,
  humanReadableSize,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'

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
                    render: (row) => (
                      <ButtonLink
                        kind="functional"
                        variant="secondary"
                        href={`/console/computing/confidential/${row.id}`}
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

            <div tw="mt-20 text-center">
              <CreateConfidentialButtonMemo>
                Create confidential instance
              </CreateConfidentialButtonMemo>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <CreateConfidentialButtonMemo>
              Create your first confidential instance
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
