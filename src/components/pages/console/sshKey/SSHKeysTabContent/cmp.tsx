import React, { memo, useCallback } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { SSHKeysTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Button, Icon } from '@aleph-front/core'
import { ellipseText } from '@/helpers/utils'
import { SSHKey } from '@/domain/ssh'

export const SSHKeysTabContent = ({ data }: SSHKeysTabContentProps) => {
  const router = useRouter()
  const handleRowClick = useCallback(
    (sshKey: SSHKey) => {
      router.push(`/console/settings/ssh/${sshKey.id}`)
    },
    [router],
  )
  return (
    <>
      <div tw="overflow-auto max-w-full">
        <EntityTable
          borderType="none"
          rowNoise
          rowKey={(row) => row.key}
          data={data}
          rowProps={(row) => ({
            onClick: () => handleRowClick(row),
            css: row.confirmed ? '' : tw`opacity-60`,
          })}
          clickableRows
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
                <Button
                  kind="functional"
                  variant="secondary"
                  onClick={() => handleRowClick(row)}
                >
                  <Icon name="angle-right" size="lg" />
                </Button>
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
