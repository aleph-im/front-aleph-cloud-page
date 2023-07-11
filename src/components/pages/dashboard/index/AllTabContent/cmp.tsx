import React from 'react'
import tw from 'twin.macro'
import { AllTabContentProps } from './types'
import { Table } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/common/ButtonLink'
import { humanReadableSize } from '@/helpers/utils'
import { EntityTypeName } from '@/helpers/constants'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export const AllTabContent = React.memo(({ data }: AllTabContentProps) => {
  const theme = useTheme()

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
                  label: 'Type',
                  sortable: true,
                  render: (row) => EntityTypeName[row.type],
                },
                {
                  label: 'Name',
                  width: '55%',
                  sortable: true,
                  render: (row) => row.name,
                },
                {
                  label: 'Size',
                  align: 'right',
                  sortable: true,
                  render: (row) => humanReadableSize(row.size, 'mb'),
                },
                {
                  label: 'Date',
                  align: 'right',
                  sortable: true,
                  render: (row) => row.date,
                },
                {
                  label: '',
                  width: '0',
                  align: 'right',
                  render: (row) => (
                    <ButtonLink
                      color={row.confirmed ? 'main0' : 'main2'}
                      href={`/dashboard/manage?hash=${row.id}`}
                    >
                      {row.confirmed ? (
                        <>&gt;</>
                      ) : (
                        <>
                          <RotatingLines
                            strokeColor={theme.color.main2}
                            animationDuration="1"
                            width="1em"
                          />
                        </>
                      )}
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
          <ButtonLink variant="primary" href="/dashboard/function">
            Create your first function
          </ButtonLink>
        </div>
      )}
    </>
  )
})
AllTabContent.displayName = 'AllTabContent'

export default AllTabContent
