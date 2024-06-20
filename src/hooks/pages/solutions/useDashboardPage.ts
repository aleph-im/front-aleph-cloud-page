import { useMemo } from 'react'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { useSPARedirect } from '@/hooks/common/useSPARedirect'
import { Program } from '@/domain/program'
import { Instance } from '@/domain/instance'
import { RequestState } from '@aleph-front/core'
import { ExecutableStatus } from '@/domain/executable'
import {
  UseAttachedVolumesReturn,
  useAttachedVolumes,
} from '@/hooks/common/useAttachedVolumes'

export type StorageAggregatedStatus = UseAttachedVolumesReturn

export type ComputingAggregatedStatus = {
  running: number
  paused: number
  booting: number
  total: number
}
export type WebsitesAggregatedStatus = {
  total: number
}

export type UseDashboardPageReturn = {
  programAggregatedStatus: ComputingAggregatedStatus
  instanceAggregatedStatus: ComputingAggregatedStatus
  volumesAggregatedStatus: UseAttachedVolumesReturn
  websitesAggregatedStatus: WebsitesAggregatedStatus
}

function calculateComputingEntitiesAggregatedStatus({
  entities,
  entitiesStatus,
}: {
  entities: Program[] | Instance[]
  entitiesStatus: Record<string, RequestState<ExecutableStatus>>
}) {
  return entities.reduce(
    (ac, cv) => {
      const statusKey = !cv.confirmed
        ? 'booting'
        : !!entitiesStatus[cv.id]?.data?.vm_ipv6
          ? 'running'
          : 'paused'

      ac[statusKey] += 1
      ac.total += 1
      return ac
    },
    {
      running: 0,
      paused: 0,
      booting: 0,
      total: 0,
    },
  )
}

export function useDashboardPage(): UseDashboardPageReturn {
  useSPARedirect()

  const { programs, instances, websites, volumes } = useAccountEntities()

  const { status: programsStatus } = useRequestExecutableStatus({
    entities: programs,
  })

  const { status: instancesStatus } = useRequestExecutableStatus({
    entities: instances,
  })

  const programAggregatedStatus = useMemo(() => {
    return calculateComputingEntitiesAggregatedStatus({
      entities: programs,
      entitiesStatus: programsStatus,
    })
  }, [programsStatus, programs])

  const instanceAggregatedStatus = useMemo(() => {
    return calculateComputingEntitiesAggregatedStatus({
      entities: instances,
      entitiesStatus: instancesStatus,
    })
  }, [instancesStatus, instances])

  const volumesAggregatedStatus = useAttachedVolumes({
    programs,
    instances,
    websites,
    volumes,
  })

  const websitesAggregatedStatus = useMemo(() => {
    return { total: websites.length }
  }, [websites])

  console.log('programs', programs)
  return {
    programAggregatedStatus,
    instanceAggregatedStatus,
    volumesAggregatedStatus,
    websitesAggregatedStatus,
  }
}
