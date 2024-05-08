import React from 'react'
import tw from 'twin.macro'
import { SSHKeysTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Icon, NoisyContainer } from '@aleph-front/core'
import { ellipseText } from '@/helpers/utils'

export const SSHKeysTabContent = React.memo(
  ({ data }: SSHKeysTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <NoisyContainer>
              <div tw="overflow-auto max-w-full">
                <EntityTable
                  borderType="none"
                  rowNoise
                  rowKey={(row) => row.key}
                  data={data}
                  rowProps={(row) => ({
                    css: row.confirmed ? '' : tw`opacity-60`,
                  })}
                  columns={[
                    {
                      label: 'Label',
                      sortable: true,
                      render: (row) => row.label || '-',
                    },
                    {
                      label: 'SSH Key',
                      sortable: true,
                      width: '100%',
                      render: (row) => ellipseText(row.key, 32, 32),
                      cellProps: () => ({
                        css: tw`max-w-0 whitespace-nowrap overflow-hidden text-ellipsis pr-3!`,
                      }),
                    },
                    {
                      label: '',
                      align: 'right',
                      render: (row) => (
                        <ButtonLink
                          kind="functional"
                          variant="secondary"
                          href={`/configure/ssh/${row.id}`}
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
            <div tw="mt-20 text-center">
              <ButtonLink variant="primary" href="/configure/ssh/new">
                Create ssh key
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/configure/ssh/new">
              Create your first ssh key
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
SSHKeysTabContent.displayName = 'SSHKeysTabContent'

export default SSHKeysTabContent
