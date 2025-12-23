import { UseEntityCostReturn } from './useEntityCost'

export type UseCanAffordProps = {
  accountCreditBalance: number
  cost: UseEntityCostReturn
}

export type UseCanAffordReturn = {
  canAfford: boolean
  isCreateButtonDisabled: boolean
}

export function useCanAfford({
  accountCreditBalance,
  cost,
}: UseCanAffordProps): UseCanAffordReturn {
  const canAfford =
    accountCreditBalance >=
    (cost.cost ? cost.cost.cost : Number.MAX_SAFE_INTEGER)

  const isCreateButtonDisabled =
    process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true'
      ? false
      : !canAfford

  return {
    canAfford,
    isCreateButtonDisabled,
  }
}
