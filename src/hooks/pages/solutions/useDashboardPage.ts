import { useMemo } from 'react'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { useAppState } from '@/contexts/appState'
import { useSPARedirect } from '@/hooks/common/useSPARedirect'

export type AggregatedStatus = {
  running: number
  paused: number
  booting: number
  total: number
}

export type UseDashboardPageReturn = {
  programAggregatedStatus: AggregatedStatus
  instanceAggregatedStatus: AggregatedStatus
  cardType: 'introduction' | 'active' | undefined
}

export function useDashboardPage(): UseDashboardPageReturn {
  useSPARedirect()

  const { programs, instances, ...entities } = useAccountEntities()

  const { status: programsStatus } = useRequestExecutableStatus({
    entities: programs,
  })

  const { status: instancesStatus } = useRequestExecutableStatus({
    entities: instances,
  })

  const programAggregatedStatus = useMemo(() => {
    return programs.reduce(
      (ac, cv) => {
        const key = !cv.confirmed
          ? 'booting'
          : !!programsStatus[cv.id]?.data?.vm_ipv6
            ? 'running'
            : 'paused'

        ac[key] += 1
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
  }, [programsStatus, programs])

  const instanceAggregatedStatus = useMemo(() => {
    return instances.reduce(
      (ac, cv) => {
        const key = !cv.confirmed
          ? 'booting'
          : !!instancesStatus[cv.id]?.data?.vm_ipv6
            ? 'running'
            : 'paused'

        ac[key] += 1
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
  }, [instancesStatus, instances])

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
    cardType,
  }
}
