import React from 'react'
import tw from 'twin.macro'
import { DomainsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Icon, NoisyContainer } from '@aleph-front/core'
import IconText from '@/components/common/IconText'
import { Text } from '../common'
import { EntityDomainTypeName } from '@/helpers/constants'

export const DomainsTabContent = React.memo(
  ({ data }: DomainsTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
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
                      width: '50%',
                      sortable: true,
                      render: (row) => (
                        <a
                          href={`https://${row.name}`}
                          target="_blank"
                          referrerPolicy="no-referrer"
                        >
                          <IconText iconName="square-up-right">
                            <Text tw="not-italic! font-bold!" as={'span'}>
                              {row.name}
                            </Text>
                          </IconText>
                        </a>
                      ),
                    },
                    {
                      label: 'Target',
                      sortable: true,
                      render: (row) => EntityDomainTypeName[row.target],
                    },
                    {
                      label: 'Ref',
                      width: '50%',
                      sortable: true,
                      render: (row) => row.ref,
                      cellProps: () => ({
                        css: tw`max-w-0 whitespace-nowrap overflow-hidden text-ellipsis px-3!`,
                      }),
                    },
                    {
                      label: '',
                      align: 'right',
                      render: (row) => (
                        <ButtonLink
                          kind="functional"
                          variant="secondary"
                          href={`/configure/domain/${row.id}`}
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
              <ButtonLink variant="primary" href="/configure/domain/new">
                Create domain
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/configure/domain/new">
              Create your first domain
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
DomainsTabContent.displayName = 'DomainsTabContent'

export default DomainsTabContent
