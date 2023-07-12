import React from 'react'
import tw from 'twin.macro'
import { DomainsTabContentProps } from './types'
import { Table } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/common/ButtonLink'
import { EntityType } from '@/helpers/constants'

export const DomainsTabContent = React.memo(
  ({ data }: DomainsTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <Table
                borderType="none"
                oddRowNoise
                rowKey={(row) => row.id}
                data={data}
                rowProps={(row) => ({
                  css: row.confirmed ? '' : tw`opacity-60`,
                })}
                columns={[
                  {
                    label: 'Name',
                    sortable: true,
                    render: (row) => row.name,
                  },
                  {
                    label: 'Type',
                    sortable: true,
                    render: (row) => row.target,
                  },
                  {
                    label: 'Ref',
                    sortable: true,
                    width: '60%',
                    render: (row) => row.ref,
                    cellProps: () => ({
                      css: tw`max-w-0 whitespace-nowrap overflow-hidden text-ellipsis px-3!`,
                    }),
                  },
                  {
                    label: '',
                    width: '0',
                    align: 'right',
                    render: (row) => (
                      <ButtonLink
                        color={row.confirmed ? 'main0' : 'main2'}
                        variant="tertiary"
                        href={`/dashboard/manage?hash=aggregate/${EntityType.Domain}/${row.id}`}
                      >
                        &gt;
                      </ButtonLink>
                    ),
                    cellProps: () => ({
                      css: tw`pl-3!`,
                    }),
                  },
                ]}
              />
            </div>
            {/* <div tw="mt-20 text-center">
              <ButtonLink variant="primary" href="/dashboard/domain">
                Create domain
              </ButtonLink>
            </div> */}
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/dashboard/instance">
              Create your first instance and link a domain to it
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
DomainsTabContent.displayName = 'DomainsTabContent'

export default DomainsTabContent
