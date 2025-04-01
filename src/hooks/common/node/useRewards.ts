import { useAppState } from '@/contexts/appState'
import { RewardsResponse } from '@/domain/stake'

export type UseLastRewards = {
  lastRewardsDistribution?: RewardsResponse
  lastRewardsCalculation?: RewardsResponse
}

export function useLastRewards(): UseLastRewards {
  const [state] = useAppState()
  const { data: lastRewardsCalculation } = state.lastRewardsCalculation
  const { data: lastRewardsDistribution } = state.lastRewardsDistribution

  return {
    lastRewardsDistribution,
    lastRewardsCalculation,
  }
}

// -----------------------------

export type UseAccountRewardsProps = {
  address: string
}

export type UseAccountRewardsReturn = {
  calculatedRewards?: number
  calculatedTimestamp?: number
  distributionTimestamp?: number
}

export function useAccountRewards({
  address,
}: UseAccountRewardsProps): UseAccountRewardsReturn {
  const { lastRewardsCalculation, lastRewardsDistribution } = useLastRewards()

  const calculatedTimestamp = lastRewardsCalculation?.timestamp
  const distributionTimestamp = lastRewardsDistribution?.timestamp

  const calculatedHeight = lastRewardsCalculation?.lastHeight || 0
  const distributionHeight = lastRewardsDistribution?.lastHeight || 0

  const calculatedRewards =
    calculatedHeight >= distributionHeight
      ? lastRewardsCalculation?.rewards[address] || 0
      : 0

  return { calculatedRewards, calculatedTimestamp, distributionTimestamp }
}