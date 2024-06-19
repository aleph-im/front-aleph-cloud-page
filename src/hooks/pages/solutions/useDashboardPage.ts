import { useMemo } from 'react'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { useAppState } from '@/contexts/appState'
import { useSPARedirect } from '@/hooks/common/useSPARedirect'
import { Program } from '@/domain/program'
import { Instance } from '@/domain/instance'
import { RequestState } from '@aleph-front/core'
import { ExecutableStatus } from '@/domain/executable'
import { Volume } from '@/domain/volume'

type AggregatedStatus = {
  running: number
  paused: number
  booting: number
  total: number
}

type AggregatedStorage = {
  totalStorage: number
  totalAmount: number
  linked: {
    storage: number
    amount: number
  }
  unlinked: {
    storage: number
    amount: number
  }
}

type UseDashboardPageReturn = {
  programAggregatedStatus: AggregatedStatus
  instanceAggregatedStatus: AggregatedStatus
  volumesAggregatedStorage: AggregatedStorage
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

function calculateEntitiesAggregatedStorage({
  entities,
}: {
  entities: Volume[]
}): AggregatedStorage {
  // TODO: implement linked/unlinked storage calculation
  return entities.reduce(
    (ac, cv) => {
      ac.totalStorage += cv.size || 0
      ac.totalAmount += 1
      return ac
    },
    {
      totalStorage: 0,
      totalAmount: 0,
      linked: {
        storage: 0,
        amount: 0,
      },
      unlinked: {
        storage: 0,
        amount: 0,
      },
    },
  )
}

export function useDashboardPage(): UseDashboardPageReturn {
  useSPARedirect()

  const { programs, instances, volumes } = useAccountEntities()

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

  const volumesAggregatedStorage = useMemo(() => {
    return calculateEntitiesAggregatedStorage({ entities: volumes })
  }, [volumes])

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
