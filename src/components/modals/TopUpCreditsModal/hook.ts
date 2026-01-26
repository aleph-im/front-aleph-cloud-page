import { useCallback, useMemo, useEffect, useState, useRef } from 'react'
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
  PaymentCurrency,
} from '@/helpers/schemas/credit'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import {
  UseTopUpCreditsModalFormProps,
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
import {
  openTopUpCreditsModal,
  closeTopUpCreditsModal,
  setFocusedPaymentTxHash,
} from '@/store/ui'

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

export function useTopUpCreditsModalForm({
  onSuccess,
  refetchPaymentHistory,
}: UseTopUpCreditsModalFormProps = {}): UseTopUpCreditsModalFormReturn {
  const [appState, dispatch] = useAppState()
  const creditManager = useCreditManager()
  const { next, stop } = useCheckoutNotification({})
  const [calculatedAmount, setCalculatedAmount] = useState(defaultValues.amount)
  const [isCalculatingInitialAmount, setIsCalculatingInitialAmount] =
    useState(false)
  // Track if user has manually changed the amount
  const [hasManuallyChangedAmount, setHasManuallyChangedAmount] =
    useState(false)
  // Track the last currency used for calculation to detect changes
  const lastCalculatedCurrencyRef = useRef<PaymentCurrency>(
    defaultValues.currency,
  )

  // Calculate token amount for a given currency based on minimum credit requirement
  const calculateTokenAmountForCurrency = useCallback(
    async (currency: PaymentCurrency): Promise<number> => {
      if (!creditManager || !appState.ui.topUpCreditsMinimumBalance) {
        return defaultValues.amount
      }

      const minimumCreditsNeeded = appState.ui.topUpCreditsMinimumBalance

      const estimation = await creditManager.getCreditToTokenEstimation(
        minimumCreditsNeeded,
        defaultValues.chain,
        currency,
      )

      // Round up and ensure minimum of 100
      return Math.max(Math.ceil(estimation.tokenAmountInUnits), 100)
    },
    [creditManager, appState.ui.topUpCreditsMinimumBalance],
  )

  // Calculate initial token amount based on minimum credit requirement
  useEffect(() => {
    const calculateInitialAmount = async () => {
      if (!creditManager || !appState.ui.topUpCreditsMinimumBalance) {
        setCalculatedAmount(defaultValues.amount)
        return
      }

      setIsCalculatingInitialAmount(true)
      try {
        const finalAmount = await calculateTokenAmountForCurrency(
          defaultValues.currency,
        )
        setCalculatedAmount(finalAmount)
        lastCalculatedCurrencyRef.current = defaultValues.currency
      } catch (error) {
        console.error('Error calculating initial token amount:', error)
        // Fallback to a conservative estimate if API fails
        const fallbackAmount = Math.max(
          Math.ceil(appState.ui.topUpCreditsMinimumBalance),
          100,
        )
        setCalculatedAmount(fallbackAmount)
      } finally {
        setIsCalculatingInitialAmount(false)
      }
    }

    calculateInitialAmount()
  }, [
    creditManager,
    appState.ui.topUpCreditsMinimumBalance,
    calculateTokenAmountForCurrency,
  ])

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

        if (transactionHash) {
          dispatch(closeTopUpCreditsModal())
          dispatch(setFocusedPaymentTxHash(transactionHash))
          refetchPaymentHistory?.()
          onSuccess?.(transactionHash)
        }
      } finally {
        await stop()
      }
    },
    [creditManager, next, stop, onSuccess, refetchPaymentHistory, dispatch],
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
      amount: calculatedAmount,
    },
    onSubmit,
    resolver: zodResolver(topUpCreditsSchema),
  })

  // Update form value when calculated amount changes (only if user hasn't manually changed it)
  useEffect(() => {
    if (!hasManuallyChangedAmount) {
      setValue('amount', calculatedAmount)
    }
  }, [calculatedAmount, setValue, hasManuallyChangedAmount])

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

  // Wrap amount onChange to track manual changes
  const handleAmountChange = useCallback(
    (value: number) => {
      setHasManuallyChangedAmount(true)
      amountCtrl.field.onChange(value)
    },
    [amountCtrl.field],
  )

  // Recalculate token amount when currency changes (only if user hasn't manually changed amount)
  useEffect(() => {
    const recalculateForCurrency = async () => {
      // Only recalculate if there's a minimum balance requirement and user hasn't manually changed
      if (
        !appState.ui.topUpCreditsMinimumBalance ||
        hasManuallyChangedAmount ||
        values.currency === lastCalculatedCurrencyRef.current
      ) {
        return
      }

      setIsCalculatingInitialAmount(true)
      try {
        const newAmount = await calculateTokenAmountForCurrency(values.currency)
        setCalculatedAmount(newAmount)
        setValue('amount', newAmount)
        lastCalculatedCurrencyRef.current = values.currency
      } catch (error) {
        console.error('Error recalculating token amount for currency:', error)
      } finally {
        setIsCalculatingInitialAmount(false)
      }
    }

    recalculateForCurrency()
  }, [
    values.currency,
    hasManuallyChangedAmount,
    appState.ui.topUpCreditsMinimumBalance,
    calculateTokenAmountForCurrency,
    setValue,
  ])

  const resetForm = useCallback(() => {
    reset(defaultValues)
    setHasManuallyChangedAmount(false)
    lastCalculatedCurrencyRef.current = defaultValues.currency
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

  // Check if the current amount meets the minimum credits requirement
  const minimumCreditsNeeded = appState.ui.topUpCreditsMinimumBalance
  const hasMinimumRequirement = !!minimumCreditsNeeded

  // Determine if the estimated credits are insufficient for the minimum requirement
  const isInsufficientForMinimum = useMemo(() => {
    if (!hasMinimumRequirement || !estimation) return false
    // Compare estimated credits (totalBalance) with minimum requirement
    return totalBalance < minimumCreditsNeeded
  }, [hasMinimumRequirement, estimation, totalBalance, minimumCreditsNeeded])

  // Show warning only if user has manually changed amount and it's insufficient
  const showInsufficientWarning = useMemo(() => {
    return hasManuallyChangedAmount && isInsufficientForMinimum
  }, [hasManuallyChangedAmount, isInsufficientForMinimum])

  // Disable submit if amount is insufficient for the minimum requirement
  const isSubmitDisabled = useMemo(() => {
    return (
      !values.amount ||
      values.amount < 100 ||
      isSubmitLoading ||
      (hasMinimumRequirement && isInsufficientForMinimum)
    )
  }, [
    values.amount,
    isSubmitLoading,
    hasMinimumRequirement,
    isInsufficientForMinimum,
  ])

  return {
    values,
    control,
    amountCtrl,
    currencyCtrl,
    errors,
    handleSubmit,
    handleAmountChange,
    resetForm,
    bonus,
    totalBalance,
    isLoadingEstimation,
    isSubmitLoading,
    isCalculatingInitialAmount,
    minimumCreditsNeeded,
    showInsufficientWarning,
    isSubmitDisabled,
  }
}
