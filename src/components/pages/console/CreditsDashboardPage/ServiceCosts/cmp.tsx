import React, { memo, useMemo, useState } from 'react'
import 'twin.macro'
import { Icon, NoisyContainer, Spinner } from '@aleph-front/core'
import { StyledTable } from '@/components/common/EntityTable/styles'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { formatCredits } from '@/helpers/utils'
import { NAVIGATION_URLS } from '@/helpers/constants'
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
    const map = new Map<
      string,
      { name: string; type: string; detailPath: string }
    >()

    instances.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Instance',
        detailPath: NAVIGATION_URLS.console.computing.instances.detail(e.id),
      }),
    )
    gpuInstances.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'GPU',
        detailPath: NAVIGATION_URLS.console.computing.gpus.detail(e.id),
      }),
    )
    confidentials.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Confidential',
        detailPath: NAVIGATION_URLS.console.computing.confidentials.detail(
          e.id,
        ),
      }),
    )
    volumes.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Volume',
        detailPath: NAVIGATION_URLS.console.storage.volumes.detail(e.id),
      }),
    )
    websites.forEach((e) =>
      map.set(e.id, {
        name: (e.metadata?.name as string) || e.id.slice(0, 8),
        type: 'Website',
        detailPath: NAVIGATION_URLS.console.web3Hosting.website.detail(e.id),
      }),
    )

    return map
  }, [instances, gpuInstances, confidentials, volumes, websites])

  const enrichedResources = useMemo(() => {
    return costsResources.map((r) => {
      const entity = entityMap.get(r.item_hash)
      // cost_credit is in credits per second
      const costPerSecond = parseFloat(r.cost_credit)
      const costPerHour = costPerSecond * 3600
      const costPerDay = costPerSecond * 3600 * 24
      return {
        ...r,
        resourceName: entity?.name || r.item_hash.slice(0, 12),
        resourceType: entity?.type || 'Unknown',
        detailPath: entity?.detailPath,
        costPerHour,
        costPerDay,
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
                    label: 'STATUS',
                    align: 'left',
                    sortable: true,
                    width: '1rem',
                    render: (row) => (
                      <Icon
                        name="circle"
                        gradient={row.isActive ? 'success' : 'warning'}
                        size="10px"
                      />
                    ),
                  },
                  {
                    label: 'RESOURCE',
                    align: 'left',
                    sortable: true,
                    render: (row) =>
                      row.detailPath ? (
                        <a
                          href={row.detailPath}
                          tw="flex items-center gap-1"
                          className="text-main0"
                        >
                          {row.resourceName}
                          <Icon name="angle-right" size="10px" />
                        </a>
                      ) : (
                        <span>{row.resourceName}</span>
                      ),
                  },
                  {
                    label: 'TYPE',
                    align: 'left',
                    sortable: true,
                    render: (row) => row.resourceType,
                  },
                  {
                    label: 'TOTAL SPENT',
                    align: 'right',
                    sortable: true,
                    render: (row) => (
                      <span style={{ color: '#ef4444' }}>
                        {formatCredits(row.consumed_credits)}
                      </span>
                    ),
                  },
                  {
                    label: 'COST/HR',
                    align: 'right',
                    sortable: true,
                    render: (row) => formatCredits(row.costPerHour),
                  },
                  {
                    label: 'COST/DAY',
                    align: 'right',
                    sortable: true,
                    render: (row) => formatCredits(row.costPerDay),
                  },
                  {
                    label: '',
                    align: 'left' as const,
                    width: '100%',
                    render: () => null,
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
