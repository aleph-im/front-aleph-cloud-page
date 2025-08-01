import { useMemo } from 'react'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { Program } from '@/domain/program'
import { Instance } from '@/domain/instance'
import { RequestState } from '@aleph-front/core'
import { ExecutableStatus } from '@/domain/executable'
import { useAttachedVolumes } from '@/hooks/common/useAttachedVolumes'
import { useAuthorization } from '@/hooks/common/authorization/useAuthorization'
import { useConfidentialManager } from '@/hooks/common/useManager/useConfidentialManager'
import { GpuInstance } from '@/domain/gpuInstance'
import { Confidential } from '@/domain/confidential'
import { calculateExecutableStatus } from '@/helpers/executableStatus'

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

export type GupInstancesAggregatedStatus = InstancesAggregatedStatus

export type ConfidentialsAggregatedStatus = InstancesAggregatedStatus

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
  gpuInstanceAggregatedStatus: GupInstancesAggregatedStatus
  confidentialsAggregatedStatus: ConfidentialsAggregatedStatus
  volumesAggregatedStatus: VolumesAggregatedStatus
  websitesAggregatedStatus: WebsitesAggregatedStatus
  confidentialsAuthz: boolean
}

function calculateComputingAggregatedStatus({
  entities,
  entitiesStatus,
}: {
  entities: Program[] | Instance[] | GpuInstance[] | Confidential[]
  entitiesStatus: Record<string, RequestState<ExecutableStatus>>
}) {
  return entities.reduce(
    (ac, cv) => {
      const statusRequest = entitiesStatus[cv.id]
      const status = statusRequest?.data
      const hasTriedFetching = !statusRequest?.loading

      const calculatedStatus = calculateExecutableStatus(
        hasTriedFetching,
        status,
        cv.type,
      )

      let statusKey: 'running' | 'paused' | 'booting'

      switch (calculatedStatus) {
        case 'v1':
          const hasIpv6 = !!entitiesStatus[cv.id]?.data?.ipv6Parsed
          statusKey = hasIpv6 ? 'running' : cv.confirmed ? 'paused' : 'booting'
          break
        case 'running':
        case 'stopping':
          statusKey = 'running'
          break
        case 'stopped':
          statusKey = 'paused'
          break
        case 'preparing':
        case 'not-allocated':
        case 'loading':
        default:
          statusKey = 'booting'
          break
      }

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
  const { confidentials: confidentialsAuthz } = useAuthorization()

  const {
    programs,
    instances,
    gpuInstances,
    confidentials,
    websites,
    volumes,
  } = useAccountEntities()

  const { status: programsStatus } = useRequestExecutableStatus({
    entities: programs,
  })

  const { status: instancesStatus } = useRequestExecutableStatus({
    entities: instances,
  })

  const { status: gpuInstancesStatus } = useRequestExecutableStatus({
    entities: gpuInstances,
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

  const gpuInstanceAggregatedStatus = useMemo(() => {
    return {
      total: calculateComputingAggregatedStatus({
        entities: gpuInstances,
        entitiesStatus: gpuInstancesStatus,
      }),
    }
  }, [gpuInstancesStatus, gpuInstances])

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
    gpuInstanceAggregatedStatus,
    confidentialsAggregatedStatus,
    volumesAggregatedStatus,
    websitesAggregatedStatus,
    confidentialsAuthz,
  }
}
