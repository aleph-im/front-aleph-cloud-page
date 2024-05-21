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
import { Icon, NoisyContainer } from '@aleph-front/core'
import IconText from '@/components/common/IconText'
import { Text } from '../common'

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
          <NoisyContainer>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                rowKey={(row) => `${row.type}-${row.id}`}
                data={data}
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
                    render: (row) =>
                      row.type !== EntityType.Domain ? (
                        row.name || row.id
                      ) : (
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
                    label: 'Size / Ref',
                    align: 'right',
                    sortable: true,
                    render: (row) =>
                      row.type === EntityType.Program ? (
                        <ButtonLink
                          kind="functional"
                          variant="none"
                          size="sm"
                          href={row.url ?? ''}
                        >
                          <Icon name={'file-code'} size="lg" />
                        </ButtonLink>
                      ) : row.type === EntityType.Website ? (
                        <ButtonLink
                          kind="functional"
                          variant="none"
                          size="sm"
                          href={row.url ?? ''}
                        >
                          <Icon name={'database'} size="lg" />
                        </ButtonLink>
                      ) : row.type === EntityType.Domain ? (
                        <ButtonLink
                          kind="functional"
                          variant="none"
                          size="sm"
                          href={row.url ?? ''}
                        >
                          <Icon name={'chain'} size="lg" />
                        </ButtonLink>
                      ) : (
                        humanReadableSize(row.size, 'MiB')
                      ),
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
                        href={entityUrl(row.type, row.id)}
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
