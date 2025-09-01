import React, { memo } from 'react'
import tw from 'twin.macro'
import { SSHKeysTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'
import { ellipseText } from '@/helpers/utils'

export const SSHKeysTabContent = ({ data }: SSHKeysTabContentProps) => {
  return (
    <>
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
                  href={`/console/settings/ssh/${row.id}`}
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
      <div tw="mt-10 text-center">
        <ButtonLink variant="primary" href="/console/settings/ssh/new">
          <Icon name="plus-circle" size="lg" tw="mr-1" /> Create new SSH key
        </ButtonLink>
      </div>
    </>
  )
}
SSHKeysTabContent.displayName = 'SSHKeysTabContent'

export default memo(SSHKeysTabContent) as typeof SSHKeysTabContent
