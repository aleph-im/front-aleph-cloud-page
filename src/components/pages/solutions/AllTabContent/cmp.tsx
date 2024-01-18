import React from 'react'
import tw from 'twin.macro'
import { AllTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { humanReadableSize } from '@/helpers/utils'
import {
  EntityType,
  EntityTypeName,
  EntityTypeSlug,
  EntityTypeUrlSection,
} from '@/helpers/constants'
import EntityTable from '@/components/common/EntityTable'

export function entityUrl(type: EntityType, id: string): string {
  const chunk1 = EntityTypeUrlSection[type]
  const chunk2 = EntityTypeSlug[type]
  const chunk3 = id

  return `/${chunk1}/${chunk2}/${chunk3}`
}

export const AllTabContent = React.memo(({ data }: AllTabContentProps) => {
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
              rowProps={(row) => ({
                css: row.confirmed ? '' : tw`opacity-60`,
              })}
              columns={[
                {
                  label: 'Type',
                  sortable: true,
                  render: (row) => EntityTypeName[row.type],
                },
                {
                  label: 'Name',
                  width: '100%',
                  sortable: true,
                  render: (row) => row.name,
                },
                {
                  label: 'Size',
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
                      color={row.confirmed ? 'main0' : 'main2'}
                      variant="tertiary"
                      href={entityUrl(row.type, row.id)}
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
        </>
      ) : (
        <div tw="mt-10 text-center">
          <ButtonLink variant="primary" href="/computing/function/new">
            Create your first function
          </ButtonLink>
        </div>
      )}
    </>
  )
})
AllTabContent.displayName = 'AllTabContent'

export default AllTabContent
