import { useCallback, useMemo } from 'react'
import { useForm } from '@/hooks/common/useForm'
import { useController, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'
import {
  TopUpCreditsFormData,
  topUpCreditsSchema,
} from '@/helpers/schemas/credit'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import { UseTopUpCreditsModalReturn } from './types'

export const defaultValues: TopUpCreditsFormData = {
  amount: 100,
  currency: 'ALEPH',
  chain: 'ethereum', // 'ethereum-sepolia',
  provider: 'WALLET',
}

export function useTopUpCreditsModal(): UseTopUpCreditsModalReturn {
  const creditManager = useCreditManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: TopUpCreditsFormData) => {
      if (!creditManager) throw Err.ConnectYourWallet

      const iSteps = await creditManager.getAddSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = creditManager.addSteps(state)

      try {
        let transactionHash

        while (!transactionHash) {
          const { value, done } = await steps.next()

          if (done) {
            transactionHash = value
            break
          }

          await next(nSteps)
        }
      } finally {
        await stop()
      }
    },
    [creditManager, next, stop],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(topUpCreditsSchema),
  })

  // @note: don't use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as TopUpCreditsFormData

  const amountCtrl = useController({
    control,
    name: 'amount',
  })

  const currencyCtrl = useController({
    control,
    name: 'currency',
  })

  const resetForm = useCallback(() => {
    reset(defaultValues)
  }, [reset])

  // Calculate bonus based on amount
  // TODO: Replace with actual API call
  const bonus = useMemo(() => {
    const amount = values.amount || 0
    if (amount >= 1000) return amount * 0.2 // 20% bonus for $1000+
    if (amount >= 500) return amount * 0.1 // 10% bonus for $500+
    if (amount >= 100) return amount * 0.05 // 5% bonus for $100+
    return 0
  }, [values.amount])

  // Calculate total balance (amount + bonus)
  const totalBalance = useMemo(() => {
    const amount = values.amount || 0
    return amount + bonus
  }, [values.amount, bonus])

  return {
    values,
    control,
    amountCtrl,
    currencyCtrl,
    errors,
    handleSubmit,
    resetForm,
    bonus,
    totalBalance,
  }
}
