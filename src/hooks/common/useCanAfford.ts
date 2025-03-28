import { CostSummary } from '@/domain/cost'

export type UseCanAffordProps = {
  accountBalance: number
  cost?: CostSummary
}

export type UseCanAffordReturn = {
  canAfford: boolean
  isCreateButtonDisabled: boolean
}

export function useCanAfford({
  accountBalance,
  cost,
}: UseCanAffordProps): UseCanAffordReturn {
  const canAfford =
    accountBalance >= (cost ? cost.cost : Number.MAX_SAFE_INTEGER)

  const isCreateButtonDisabled =
    process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true'
      ? false
      : !canAfford

  return {
    canAfford,
    isCreateButtonDisabled,
  }
}
