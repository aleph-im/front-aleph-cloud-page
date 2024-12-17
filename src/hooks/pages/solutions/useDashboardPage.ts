import { useMemo } from 'react'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { useSPARedirect } from '@/hooks/common/useSPARedirect'
import { Program } from '@/domain/program'
import { Instance } from '@/domain/instance'
import { RequestState } from '@aleph-front/core'
import { ExecutableStatus } from '@/domain/executable'
import { useAttachedVolumes } from '@/hooks/common/useAttachedVolumes'
import { useAuthorization } from '@/hooks/common/authorization/useAuthorization'
import { useConfidentialManager } from '@/hooks/common/useManager/useConfidentialManager'

export type AmountAggregatedStatus = {
  amount: number
}

export type StorageAggregatedStatus = {
  amount: number
  size: number
}

export type ComputingAggregatedStatus = {
  running: number
  paused: number
  booting: number
  amount: number
}

export type InstancesAggregatedStatus = {
  total: ComputingAggregatedStatus
}

export type ConfidentialsAggregatedStatus = {
  total: ComputingAggregatedStatus
}

export type ProgramsAggregatedStatus = {
  persistent: ComputingAggregatedStatus
  onDemand: ComputingAggregatedStatus
  total: ComputingAggregatedStatus
}

export type WebsitesAggregatedStatus = {
  total: AmountAggregatedStatus
}

export type VolumesAggregatedStatus = {
  total: StorageAggregatedStatus
  linked: StorageAggregatedStatus
  unlinked: StorageAggregatedStatus
}

export type UseDashboardPageReturn = {
  programAggregatedStatus: ProgramsAggregatedStatus
  instanceAggregatedStatus: InstancesAggregatedStatus
  confidentialsAggregatedStatus: ConfidentialsAggregatedStatus
  volumesAggregatedStatus: VolumesAggregatedStatus
  websitesAggregatedStatus: WebsitesAggregatedStatus
  confidentialsAuthz: boolean
}

function calculateComputingAggregatedStatus({
  entities,
  entitiesStatus,
}: {
  entities: Program[] | Instance[]
  entitiesStatus: Record<string, RequestState<ExecutableStatus>>
}) {
  return entities.reduce(
    (ac, cv) => {
      const hasIpv6 = !!entitiesStatus[cv.id]?.data?.ipv6Parsed
      const statusKey = hasIpv6
        ? 'running'
        : cv.confirmed
          ? 'paused'
          : 'booting'

      ac[statusKey] += 1
      ac.amount += 1
      return ac
    },
    {
      running: 0,
      paused: 0,
      booting: 0,
      amount: 0,
    },
  )
}

export function useDashboardPage(): UseDashboardPageReturn {
  useSPARedirect()

  const { confidentials: confidentialsAuthz } = useAuthorization()

  const { programs, instances, confidentials, websites, volumes } =
    useAccountEntities()

  const { status: programsStatus } = useRequestExecutableStatus({
    entities: programs,
  })

  const { status: instancesStatus } = useRequestExecutableStatus({
    entities: instances,
  })

  const { status: confidentialsStatus } = useRequestExecutableStatus({
    entities: confidentials,
    managerHook: useConfidentialManager,
  })

  const programAggregatedStatus = useMemo(() => {
    return {
      total: calculateComputingAggregatedStatus({
        entities: programs,
        entitiesStatus: programsStatus,
      }),
      persistent: calculateComputingAggregatedStatus({
        entities: programs.filter((p) => p.on.persistent),
        entitiesStatus: programsStatus,
      }),
      onDemand: calculateComputingAggregatedStatus({
        entities: programs.filter((p) => !p.on.persistent),
        entitiesStatus: programsStatus,
      }),
    }
  }, [programsStatus, programs])

  const instanceAggregatedStatus = useMemo(() => {
    return {
      total: calculateComputingAggregatedStatus({
        entities: instances,
        entitiesStatus: instancesStatus,
      }),
    }
  }, [instancesStatus, instances])

  // @todo: Check if this is correct
  const confidentialsAggregatedStatus = useMemo(() => {
    return {
      total: calculateComputingAggregatedStatus({
        entities: confidentials,
        entitiesStatus: confidentialsStatus,
      }),
    }
  }, [confidentials, confidentialsStatus])

  const volumesAggregatedStatus = useAttachedVolumes({
    volumes,
  })

  const websitesAggregatedStatus = useMemo(() => {
    return { total: { amount: websites.length } }
  }, [websites])

  return {
    programAggregatedStatus,
    instanceAggregatedStatus,
    confidentialsAggregatedStatus,
    volumesAggregatedStatus,
    websitesAggregatedStatus,
    confidentialsAuthz,
  }
}
