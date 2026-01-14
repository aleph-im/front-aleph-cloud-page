import { useCallback, useMemo, useEffect, useState } from 'react'
import { useDebounceState, useLocalRequest } from '@aleph-front/core'
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
  TokenEstimationResponse,
} from '@/helpers/schemas/credit'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import {
  UseTopUpCreditsModalFormReturn,
  UseTopUpCreditsModalReturn,
} from './types'

export const defaultValues: TopUpCreditsFormData = {
  amount: 100,
  currency: 'ALEPH',
  chain: 'ethereum', // 'ethereum-sepolia',
  provider: 'WALLET',
}
import { useAppState } from '@/contexts/appState'
import { openTopUpCreditsModal, closeTopUpCreditsModal } from '@/store/ui'

export function useTopUpCreditsModal(): UseTopUpCreditsModalReturn {
  const [state, dispatch] = useAppState()

  const isOpen = state.ui.isTopUpCreditsModalOpen

  const handleOpen = useCallback(
    (minimumBalance?: number) => {
      dispatch(openTopUpCreditsModal(minimumBalance))
    },
    [dispatch],
  )

  const handleClose = useCallback(() => {
    dispatch(closeTopUpCreditsModal())
  }, [dispatch])

  return {
    isOpen,
    handleOpen,
    handleClose,
  }
}

export function useTopUpCreditsModalForm(): UseTopUpCreditsModalFormReturn {
  const [appState] = useAppState()
  const creditManager = useCreditManager()
  const { next, stop } = useCheckoutNotification({})
  const [initialAmount, setInitialAmount] = useState(defaultValues.amount)
  const [isCalculatingInitialAmount, setIsCalculatingInitialAmount] =
    useState(false)

  // Calculate initial token amount based on minimum credit requirement
  useEffect(() => {
    const calculateInitialAmount = async () => {
      if (!creditManager || !appState.ui.topUpCreditsMinimumBalance) {
        setInitialAmount(defaultValues.amount)
        return
      }

      setIsCalculatingInitialAmount(true)
      try {
        // Calculate the required token amount for the minimum credits needed
        const minimumCreditsNeeded = appState.ui.topUpCreditsMinimumBalance

        const estimation = await creditManager.getCreditToTokenEstimation(
          minimumCreditsNeeded,
          defaultValues.chain,
          defaultValues.currency,
        )

        // Convert token amount from wei to whole tokens
        // tokenAmount is in wei (18 decimals), convert to whole tokens
        const tokenAmountInWei = BigInt(estimation.tokenAmount)
        const tokensNeeded = Number(tokenAmountInWei / BigInt(10 ** 18))

        // Round up and ensure minimum of 100
        const finalAmount = Math.max(Math.ceil(tokensNeeded), 100)
        setInitialAmount(finalAmount)
      } catch (error) {
        console.error('Error calculating initial token amount:', error)
        // Fallback to a conservative estimate if API fails
        const fallbackAmount = Math.max(
          Math.ceil(appState.ui.topUpCreditsMinimumBalance),
          100,
        )
        setInitialAmount(fallbackAmount)
      } finally {
        setIsCalculatingInitialAmount(false)
      }
    }

    calculateInitialAmount()
  }, [creditManager, appState.ui.topUpCreditsMinimumBalance])

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
    setValue,
    requestState: { loading: isSubmitLoading },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      amount: initialAmount,
    },
    onSubmit,
    resolver: zodResolver(topUpCreditsSchema),
  })

  // Update form value when initial amount is calculated
  useEffect(() => {
    setValue('amount', initialAmount)
  }, [initialAmount, setValue])

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

  const debouncedAmount = useDebounceState(values.amount, 500)

  const { data: estimation, loading: isLoadingEstimation } = useLocalRequest({
    doRequest: async (): Promise<TokenEstimationResponse | null> => {
      if (!creditManager || !debouncedAmount || debouncedAmount < 100)
        return null

      return await creditManager.getTokenToCreditsEstimation(values)
    },
    onSuccess: () => null,
    onError: (error) => {
      console.error('Failed to fetch estimation:', error)
    },
    flushData: true,
    triggerOnMount: true,
    triggerDeps: [
      creditManager,
      debouncedAmount,
      values.currency,
      values.chain,
    ],
  })

  const bonus = useMemo(() => {
    return estimation?.creditBonusAmount || 0
  }, [estimation])

  const totalBalance = useMemo(() => {
    return estimation?.creditAmount || 0
  }, [estimation])

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
    isLoadingEstimation,
    isSubmitLoading,
    isCalculatingInitialAmount,
  }
}
