import { useMemo } from 'react'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { useAppState } from '@/contexts/appState'
import { useSPARedirect } from '@/hooks/common/useSPARedirect'
import { Program } from '@/domain/program'
import { Instance } from '@/domain/instance'
import { RequestState } from '@aleph-front/core'
import { ExecutableStatus } from '@/domain/executable'
import {
  UseAttachedVolumesReturn,
  useAttachedVolumes,
} from '@/hooks/common/useAttachedVolumes'

export type AggregatedStatus = {
  running: number
  paused: number
  booting: number
  total: number
}

export type UseDashboardPageReturn = {
  programAggregatedStatus: AggregatedStatus
  instanceAggregatedStatus: AggregatedStatus
  volumesAggregatedStorage: UseAttachedVolumesReturn
  cardType: 'introduction' | 'active' | undefined
}

function calculateEntitiesAggregatedStatus({
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
    return calculateEntitiesAggregatedStatus({
      entities: programs,
      entitiesStatus: programsStatus,
    })
  }, [programsStatus, programs])

  const instanceAggregatedStatus = useMemo(() => {
    return calculateEntitiesAggregatedStatus({
      entities: instances,
      entitiesStatus: instancesStatus,
    })
  }, [instancesStatus, instances])

  const volumesAggregatedStorage = useAttachedVolumes({
    programs,
    instances,
    websites,
    volumes,
  })

  const noEntities = useMemo(() => {
    return programAggregatedStatus.total + instanceAggregatedStatus.total === 0
  }, [instanceAggregatedStatus.total, programAggregatedStatus.total])

  const [state] = useAppState()
  const { account } = state.connection

  const userStage = useMemo(() => {
    if (!account) return 'new'
    if (noEntities) return 'new'

    return 'active'
  }, [account, noEntities])

  const cardType = useMemo(() => {
    return userStage === 'active' ? 'active' : 'introduction'
  }, [userStage])

  return {
    programAggregatedStatus,
    instanceAggregatedStatus,
    volumesAggregatedStorage,
    cardType,
  }
}
