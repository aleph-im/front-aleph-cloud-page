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
import { MIN_CREDITS_TOPUP } from '@/domain/credit'
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
  // Start as true when there's a minimum balance requirement to prevent
  // showing errors before the proper amount is calculated
  const [isCalculatingInitialAmount, setIsCalculatingInitialAmount] = useState(
    !!appState.ui.topUpCreditsMinimumBalance,
  )
  // Track if user has manually changed the amount
  const [hasManuallyChangedAmount, setHasManuallyChangedAmount] =
    useState(false)
  // Track the last currency used for calculation to detect changes
  const lastCalculatedCurrencyRef = useRef<PaymentCurrency>(
    defaultValues.currency,
  )
  // Track the minimum token amount for the current currency
  const [minimumTokenAmount, setMinimumTokenAmount] = useState<number>(0)

  // The minimum credits needed (passed value or default, but always at least MIN_CREDITS_TOPUP)
  const minimumCreditsNeeded = Math.max(
    appState.ui.topUpCreditsMinimumBalance || MIN_CREDITS_TOPUP,
    MIN_CREDITS_TOPUP,
  )

  // Calculate token amount for a given currency based on credit requirement
  const calculateTokenAmountForCredits = useCallback(
    async (
      currency: PaymentCurrency,
      creditsNeeded: number,
    ): Promise<number> => {
      if (!creditManager) return defaultValues.amount

      const estimation = await creditManager.getCreditToTokenEstimation(
        creditsNeeded,
        defaultValues.chain,
        currency,
      )

      // Round up to ensure we meet the minimum credits
      return Math.ceil(estimation.tokenAmountInUnits)
    },
    [creditManager],
  )

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

  // Recalculate token amount when currency changes (if user hasn't manually changed amount)
  useEffect(() => {
    const updateForCurrency = async () => {
      if (!creditManager) return
      if (hasManuallyChangedAmount) return
      if (values.currency === lastCalculatedCurrencyRef.current) return

      setIsCalculatingInitialAmount(true)
      try {
        const newAmount = await calculateTokenAmountForCredits(
          values.currency,
          minimumCreditsNeeded,
        )
        setCalculatedAmount(newAmount)
        setMinimumTokenAmount(newAmount)
        setValue('amount', newAmount)
        lastCalculatedCurrencyRef.current = values.currency
      } catch (error) {
        console.error('Error updating amounts for currency:', error)
      } finally {
        setIsCalculatingInitialAmount(false)
      }
    }

    updateForCurrency()
  }, [
    creditManager,
    values.currency,
    hasManuallyChangedAmount,
    minimumCreditsNeeded,
    calculateTokenAmountForCredits,
    setValue,
  ])

  const resetForm = useCallback(() => {
    reset(defaultValues)
    setHasManuallyChangedAmount(false)
    lastCalculatedCurrencyRef.current = defaultValues.currency
  }, [reset])

  // Reset form and recalculate amount when modal opens
  const isModalOpen = appState.ui.isTopUpCreditsModalOpen
  const prevIsModalOpenRef = useRef(isModalOpen)
  useEffect(() => {
    // Only run when modal transitions from closed to open
    if (!isModalOpen || prevIsModalOpenRef.current) {
      prevIsModalOpenRef.current = isModalOpen
      return
    }
    prevIsModalOpenRef.current = isModalOpen

    resetForm()

    // Calculate the proper token amount for minimum credit requirement
    const calculateAmount = async () => {
      if (!creditManager) {
        setCalculatedAmount(defaultValues.amount)
        setIsCalculatingInitialAmount(false)
        return
      }

      setIsCalculatingInitialAmount(true)
      try {
        const finalAmount = await calculateTokenAmountForCredits(
          defaultValues.currency,
          minimumCreditsNeeded,
        )
        setCalculatedAmount(finalAmount)
        setMinimumTokenAmount(finalAmount)
        setValue('amount', finalAmount)
      } catch (error) {
        console.error('Error calculating initial token amount:', error)
        setCalculatedAmount(defaultValues.amount)
      } finally {
        setIsCalculatingInitialAmount(false)
      }
    }

    calculateAmount()
  }, [
    isModalOpen,
    resetForm,
    creditManager,
    minimumCreditsNeeded,
    calculateTokenAmountForCredits,
    setValue,
  ])

  const debouncedAmount = useDebounceState(values.amount, 500)

  const { data: estimation, loading: isLoadingEstimation } = useLocalRequest({
    doRequest: async (): Promise<TokenEstimationResponse | null> => {
      if (!creditManager || !debouncedAmount || debouncedAmount <= 0)
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

  // Calculate base credits (excluding bonus) for minimum validation
  const baseCredits = useMemo(() => {
    if (!estimation) return 0
    return estimation.creditAmount - estimation.creditBonusAmount
  }, [estimation])

  // Check if base credits are below the minimum (excluding bonus)
  const isBelowMinimumCredits = useMemo(() => {
    if (!estimation || isCalculatingInitialAmount) return false
    return baseCredits < minimumCreditsNeeded
  }, [
    estimation,
    isCalculatingInitialAmount,
    baseCredits,
    minimumCreditsNeeded,
  ])

  // Show warning only if user has manually changed amount and it's insufficient
  const showInsufficientWarning = useMemo(() => {
    return hasManuallyChangedAmount && isBelowMinimumCredits
  }, [hasManuallyChangedAmount, isBelowMinimumCredits])

  // Disable submit if amount is insufficient for the minimum requirement
  const isSubmitDisabled = useMemo(() => {
    return (
      !values.amount ||
      values.amount <= 0 ||
      isSubmitLoading ||
      isCalculatingInitialAmount ||
      isBelowMinimumCredits
    )
  }, [
    values.amount,
    isSubmitLoading,
    isCalculatingInitialAmount,
    isBelowMinimumCredits,
  ])

  return {
    values,
    control,
    amountCtrl,
    currencyCtrl,
    errors,
    handleSubmit,
    handleAmountChange,
    bonus,
    totalBalance,
    isLoadingEstimation,
    isSubmitLoading,
    isCalculatingInitialAmount,
    minimumCreditsNeeded,
    minimumTokenAmount,
    isBelowMinimumCredits,
    showInsufficientWarning,
    isSubmitDisabled,
  }
}
