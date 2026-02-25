import React, { memo, useCallback, useMemo, useState } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { DomainsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import EntityTable from '@/components/common/EntityTable'
import { BulletItem, Button, Icon } from '@aleph-front/core'
import IconText from '@/components/common/IconText'
import { Text } from '../../common'
import {
  EntityDomainType,
  EntityDomainTypeName,
  NAVIGATION_URLS,
} from '@/helpers/constants'
import { useDomainsEntityNames } from '@/hooks/common/useDomainsEntityNames'
import { useDomainStatuses } from '@/hooks/common/useDomainStatuses'
import { Domain } from '@/domain/domain'

export const DomainsTabContent = ({
  data,
  cta = true,
}: DomainsTabContentProps) => {
  const router = useRouter()
  const handleRowClick = useCallback(
    (domain: Domain) => {
      router.push(NAVIGATION_URLS.console.domain.detail(domain.id))
    },
    [router],
  )
  const entityNames = useDomainsEntityNames(data)
  const statuses = useDomainStatuses(data)

  const pageSize = 10
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(data.length / pageSize)
  const pageData = useMemo(
    () => data.slice(page * pageSize, (page + 1) * pageSize),
    [data, page],
  )

  return (
    <>
      <div tw="overflow-auto max-w-full">
        <EntityTable
          borderType="none"
          rowNoise
          rowKey={(row) => row.id}
          data={pageData}
          rowProps={(row) => ({
            onClick: () => handleRowClick(row),
            css: row.confirmed ? '' : tw`opacity-60`,
          })}
          clickableRows
          columns={[
            {
              label: 'Name',
              width: '50%',
              sortable: true,
              render: (row) => {
                const status = statuses.get(row.id)
                return (
                  <div tw="flex items-center gap-2">
                    <BulletItem
                      kind={
                        status === undefined
                          ? 'warning'
                          : status.status
                            ? 'success'
                            : 'warning'
                      }
                      title=""
                    />
                    <a
                      href={`https://${row.name}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <IconText iconName="square-up-right">
                        <Text tw="not-italic! font-bold!">{row.name}</Text>
                      </IconText>
                    </a>
                  </div>
                )
              },
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
      {pageCount > 1 && (
        <div tw="flex items-center justify-center gap-4 mt-6">
          <Button
            kind="functional"
            variant="secondary"
            size="md"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <Icon name="angle-left" size="lg" />
          </Button>
          <span className="tp-body2">
            {page + 1} / {pageCount}
          </span>
          <Button
            kind="functional"
            variant="secondary"
            size="md"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <Icon name="angle-right" size="lg" />
          </Button>
        </div>
      )}
      {cta && (
        <div tw="mt-10 text-center">
          <ButtonLink
            variant="primary"
            href={NAVIGATION_URLS.console.domain.new}
          >
            <Icon name="plus-circle" size="lg" tw="mr-1" /> Create new domain
          </ButtonLink>
        </div>
      )}
    </>
  )
}
DomainsTabContent.displayName = 'DomainsTabContent'

export default memo(DomainsTabContent) as typeof DomainsTabContent
