import { useMemo, useCallback } from 'react'
import { UseEntityCostReturn } from '@/hooks/common/useEntityCost'
import { useTopUpCreditsModal } from '@/components/modals/TopUpCreditsModal/hook'

export type InsufficientFundsInfo = {
  hasInsufficientFunds: boolean
  remainingCredits: number
  minimumBalanceNeeded: number
  onTopUpClick: () => void
}

export type UseInsufficientFundsProps = {
  cost: UseEntityCostReturn
  accountCreditBalance: number
  isConnected: boolean
}

export type UseInsufficientFundsReturn = {
  hasEnoughBalanceForOneDay: boolean
  topUpAmount: number
  minimumBalanceNeeded: number
  isDisabledDueToInsufficientFunds: boolean
  insufficientFundsInfo?: InsufficientFundsInfo
}

export function useInsufficientFunds({
  cost,
  accountCreditBalance,
  isConnected,
}: UseInsufficientFundsProps): UseInsufficientFundsReturn {
  const { handleOpen: handleOpenTopUpModal } = useTopUpCreditsModal()

  // Calculate minimum balance needed for 24 hours of runtime
  const minimumBalanceNeeded = useMemo(() => {
    if (!cost?.cost?.cost) return 0
    return cost.cost.cost * 24
  }, [cost?.cost?.cost])

  // Check if user has enough balance for at least 24 hours
  const hasEnoughBalanceForOneDay = useMemo(() => {
    return accountCreditBalance >= minimumBalanceNeeded
  }, [accountCreditBalance, minimumBalanceNeeded])

  // Calculate the amount needed to top up (if insufficient)
  const topUpAmount = useMemo(() => {
    if (hasEnoughBalanceForOneDay) return 0
    return minimumBalanceNeeded - accountCreditBalance
  }, [hasEnoughBalanceForOneDay, minimumBalanceNeeded, accountCreditBalance])

  // Handler to open top up modal with calculated amount
  const handleTopUpClick = useCallback(() => {
    handleOpenTopUpModal(topUpAmount)
  }, [handleOpenTopUpModal, topUpAmount])

  // Is disabled specifically due to insufficient funds (not other reasons)
  const isDisabledDueToInsufficientFunds = useMemo(() => {
    return isConnected && !hasEnoughBalanceForOneDay
  }, [isConnected, hasEnoughBalanceForOneDay])

  // Unified insufficient funds info for both CheckoutSummary and CheckoutButton
  const insufficientFundsInfo: InsufficientFundsInfo | undefined =
    useMemo(() => {
      if (!isConnected || hasEnoughBalanceForOneDay) return undefined
      return {
        hasInsufficientFunds: true,
        remainingCredits: topUpAmount,
        minimumBalanceNeeded,
        onTopUpClick: handleTopUpClick,
      }
    }, [
      isConnected,
      hasEnoughBalanceForOneDay,
      topUpAmount,
      minimumBalanceNeeded,
      handleTopUpClick,
    ])

  return {
    hasEnoughBalanceForOneDay,
    topUpAmount,
    minimumBalanceNeeded,
    isDisabledDueToInsufficientFunds,
    insufficientFundsInfo,
  }
}
