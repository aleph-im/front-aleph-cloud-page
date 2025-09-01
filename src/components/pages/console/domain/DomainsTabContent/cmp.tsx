import React, { memo } from 'react'
import tw from 'twin.macro'
import { DomainsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { Icon } from '@aleph-front/core'
import IconText from '@/components/common/IconText'
import { Text } from '../../common'
import { EntityDomainType, EntityDomainTypeName } from '@/helpers/constants'
import { useDomainsEntityNames } from '@/hooks/common/useDomainsEntityNames'

export const DomainsTabContent = ({
  data,
  cta = true,
}: DomainsTabContentProps) => {
  const entityNames = useDomainsEntityNames(data)

  return (
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
                    <Text tw="not-italic! font-bold!">{row.name}</Text>
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
              render: (row) => {
                if (row.target === EntityDomainType.IPFS) {
                  return row.ref
                }

                return entityNames.get(row.ref) ?? row.ref
              },
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
                  href={`/console/settings/domain/${row.id}`}
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
      {cta && (
        <div tw="mt-10 text-center">
          <ButtonLink variant="primary" href="/console/settings/domain/new">
            <Icon name="plus-circle" size="lg" tw="mr-1" /> Create new domain
          </ButtonLink>
        </div>
      )}
    </>
  )
}
DomainsTabContent.displayName = 'DomainsTabContent'

export default memo(DomainsTabContent) as typeof DomainsTabContent
