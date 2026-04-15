import React, { memo, useMemo, useState } from 'react'
import 'twin.macro'
import { Icon, NoisyContainer, Spinner } from '@aleph-front/core'
import { StyledTable } from '@/components/common/EntityTable/styles'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { formatCredits } from '@/helpers/utils'
import { StyledScrollableTableContainer } from '../styles'
import { ServiceCostsProps } from './types'

const EmptyTablePlaceholder = ({ message }: { message: string }) => (
  <NoisyContainer tw="text-center py-8">
    <Icon name="info-circle" color="base2" size="lg" tw="mb-3" />
    <p className="text-base2 tp-body1">{message}</p>
  </NoisyContainer>
)

const ServiceCosts = ({
  isConnected,
  costsResources,
  costsLoading,
}: ServiceCostsProps) => {
  const [open, setOpen] = useState(true)

  const { instances, gpuInstances, confidentials, volumes, websites } =
    useAccountEntities()

  const entityMap = useMemo(() => {
    const map = new Map<string, { name: string; type: string }>()

    instances.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Instance',
      }),
    )
    gpuInstances.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'GPU',
      }),
    )
    confidentials.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Confidential',
      }),
    )
    volumes.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Volume',
      }),
    )
    websites.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Website',
      }),
    )

    return map
  }, [instances, gpuInstances, confidentials, volumes, websites])

  const enrichedResources = useMemo(() => {
    return costsResources.map((r) => {
      const entity = entityMap.get(r.item_hash)
      const costPerHour = parseFloat(r.cost_credit)
      return {
        ...r,
        resourceName: entity?.name || r.item_hash.slice(0, 12),
        resourceType: entity?.type || 'Unknown',
        costPerHour,
        costPerDay: costPerHour * 24,
        isActive: !!entity,
      }
    })
  }, [costsResources, entityMap])

  return (
    <section tw="px-0 pb-6 pt-6 lg:pb-5">
      <SectionTitle>
        <span tw="flex items-center gap-3">
          Service Costs
          {costsLoading && <Spinner size="1.5em" color="main0" />}
        </span>
      </SectionTitle>
      <ToggleDashboard
        open={open}
        setOpen={setOpen}
        toggleButton={{
          children: (
            <>
              Show service costs <Icon name="server" />
            </>
          ),
          disabled: !isConnected,
        }}
      >
        <div>
          {enrichedResources.length > 0 ? (
            <StyledScrollableTableContainer $maxHeight="28rem">
              <StyledTable
                rowKey={(row) => row.item_hash}
                data={enrichedResources}
                columns={[
                  {
                    label: 'RESOURCE',
                    align: 'left',
                    sortable: true,
                    render: (row) => (
                      <a
                        href={`https://explorer.aleph.im/address/ETH/${row.owner}/message/POST/${row.item_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        tw="flex items-center gap-1"
                        className="text-main0"
                      >
                        {row.resourceName}
                        <Icon name="external-link-square-alt" size="10px" />
                      </a>
                    ),
                  },
                  {
                    label: 'TYPE',
                    align: 'left',
                    sortable: true,
                    render: (row) => row.resourceType,
                  },
                  {
                    label: 'CONSUMED',
                    align: 'right',
                    sortable: true,
                    render: (row) => formatCredits(row.consumed_credits),
                  },
                  {
                    label: 'COST/HR',
                    align: 'right',
                    sortable: true,
                    render: (row) => formatCredits(row.costPerHour * 1_000_000),
                  },
                  {
                    label: 'COST/DAY',
                    align: 'right',
                    sortable: true,
                    render: (row) => formatCredits(row.costPerDay * 1_000_000),
                  },
                  {
                    label: 'STATUS',
                    align: 'center',
                    sortable: true,
                    render: (row) => (
                      <Icon
                        name="circle"
                        gradient={row.isActive ? 'success' : 'warning'}
                        size="10px"
                      />
                    ),
                  },
                ]}
              />
            </StyledScrollableTableContainer>
          ) : (
            <EmptyTablePlaceholder message="No active services consuming credits." />
          )}
        </div>
      </ToggleDashboard>
    </section>
  )
}
ServiceCosts.displayName = 'ServiceCosts'

export default memo(ServiceCosts)
