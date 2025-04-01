import { useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
import { useAppStoreRequest } from '../useStoreRequest'
import { RewardsResponse, StakeManager } from '@/domain/stake'

export type UseRequestRewardsProps = {
  triggerDeps?: unknown[]
}

export type UseRequestRewardsReturn = {
  lastRewardsDistribution?: RewardsResponse
  lastRewardsCalculation?: RewardsResponse
}

export function useRequestRewards({
  triggerDeps,
}: UseRequestRewardsProps = {}): UseRequestRewardsReturn {
  const [state] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const manager = useMemo(() => new StakeManager(account), [account])

  // -----------------------------

  const { data: lastRewardsDistribution } = useAppStoreRequest({
    name: 'lastRewardsDistribution',
    doRequest: () => manager.getLastRewardsDistribution(),
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  const { data: lastRewardsCalculation } = useAppStoreRequest({
    name: 'lastRewardsCalculation',
    doRequest: () => manager.getLastRewardsCalculation(),
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  return {
    lastRewardsDistribution,
    lastRewardsCalculation,
  }
}