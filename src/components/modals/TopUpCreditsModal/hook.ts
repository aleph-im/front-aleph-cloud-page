import { useCallback, useMemo, useEffect, useState, useRef } from 'react'
import { useDebounceState, useLocalRequest } from '@aleph-front/core'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { useFundWallet } from '@privy-io/react-auth'
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
import { useEthereumNetwork } from '@/hooks/common/useEthereumNetwork'
import { ProviderId } from '@/domain/connect'
import {
  UseTopUpCreditsModalFormProps,
  UseTopUpCreditsModalFormReturn,
  UseTopUpCreditsModalReturn,
} from './types'
import { useAppState } from '@/contexts/appState'
import {
  openTopUpCreditsModal,
  closeTopUpCreditsModal,
  setFocusedPaymentId,
} from '@/store/ui'
import { useRefreshBalance } from '@/hooks/common/useRefreshBalance'

export const defaultValues: Omit<TopUpCreditsFormData, 'amount'> & {
  amount?: number
} = {
  amount: undefined,
  currency: 'ALEPH',
  chain: 'ethereum', // 'ethereum-sepolia',
  provider: 'WALLET',
}

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

// CARD is not a token — it settles in USDC. Map it so the estimation API
// receives a valid token identifier.
function estimationCurrency(currency: PaymentCurrency): PaymentCurrency {
  return currency === 'CARD' ? 'USDC' : currency
}

// Pick the first payment method the user can actually use, given fresh balances.
function pickFirstEnabledCurrency(
  balance: number,
  ethBalance: number,
  usdcBalance: number,
  isPrivy: boolean,
): PaymentCurrency {
  if (balance > 0) return 'ALEPH'
  if (ethBalance > 0) return 'ETH'
  if (usdcBalance > 0) return 'USDC'
  if (isPrivy) return 'CARD'
  return 'ALEPH'
}

export function useTopUpCreditsModalForm({
  onSuccess,
  refetchPaymentHistory,
}: UseTopUpCreditsModalFormProps = {}): UseTopUpCreditsModalFormReturn {
  const [appState, dispatch] = useAppState()
  const creditManager = useCreditManager()
  const { isEthereumNetwork, getEthereumNetworkTooltip } = useEthereumNetwork()
  const { next, stop } = useCheckoutNotification({})

  const { client: smartWalletClient } = useSmartWallets()
  const isPrivyConnection = appState.connection.provider === ProviderId.Privy
  const smartWalletAddress = appState.connection.smartWalletAddress
  const isGasSponsored =
    isPrivyConnection && !!smartWalletClient && !!smartWalletAddress
  const [isOnrampProcessing, setIsOnrampProcessing] = useState(false)

  const refreshBalance = useRefreshBalance()

  const alephEnabled = (appState.connection.balance ?? 0) > 0
  const ethEnabled = (appState.connection.ethBalance ?? 0) > 0
  const usdcEnabled = (appState.connection.usdcBalance ?? 0) > 0
  const alephDisabledReason = alephEnabled
    ? undefined
    : "You don't have any ALEPH in your wallet"
  const ethDisabledReason = ethEnabled
    ? undefined
    : "You don't have any ETH in your wallet"
  const usdcDisabledReason = usdcEnabled
    ? undefined
    : "You don't have any USDC in your wallet"
  const cardDisabledReason = isPrivyConnection
    ? undefined
    : 'Card payments require Privy sign-in'

  const { fundWallet } = useFundWallet({
    onUserExited: useCallback(() => {
      setIsOnrampProcessing(true)
      dispatch(closeTopUpCreditsModal())
      refetchPaymentHistory?.()
    }, [dispatch, refetchPaymentHistory]),
  })

  const [isCalculatingInitialAmount, setIsCalculatingInitialAmount] = useState(
    !!appState.ui.topUpCreditsMinimumBalance,
  )
  const [hasManuallyChangedAmount, setHasManuallyChangedAmount] =
    useState(false)
  const lastCalculatedCurrencyRef = useRef<PaymentCurrency>(
    defaultValues.currency,
  )
  const [minimumTokenAmount, setMinimumTokenAmount] = useState<number>(0)

  const minimumCreditsNeeded = Math.max(
    appState.ui.topUpCreditsMinimumBalance ?? 0,
    MIN_CREDITS_TOPUP,
  )

  const calculateTokenAmountForCredits = useCallback(
    async (
      currency: PaymentCurrency,
      creditsNeeded: number,
    ): Promise<number> => {
      if (!creditManager) return 0

      const estimation = await creditManager.getCreditToTokenEstimation(
        creditsNeeded,
        defaultValues.chain,
        estimationCurrency(currency),
      )

      return Math.ceil(estimation.tokenAmountInUnits)
    },
    [creditManager],
  )

  const onSubmit = useCallback(
    async (state: TopUpCreditsFormData) => {
      if (!creditManager) throw Err.ConnectYourWallet
      if (!isEthereumNetwork) throw Err.InvalidNetwork

      const iSteps = await creditManager.getAddSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = creditManager.addSteps(
        state,
        isGasSponsored
          ? { smartWalletClient, senderAddress: smartWalletAddress }
          : undefined,
      )

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
          const { txHash, paymentId } = transactionHash
          dispatch(closeTopUpCreditsModal())
          dispatch(setFocusedPaymentId(paymentId))
          refetchPaymentHistory?.()
          onSuccess?.(txHash)
        }
      } finally {
        await stop()
      }
    },
    [
      creditManager,
      isEthereumNetwork,
      next,
      stop,
      onSuccess,
      refetchPaymentHistory,
      dispatch,
      isGasSponsored,
      smartWalletClient,
      smartWalletAddress,
    ],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
    requestState: { loading: isSubmitLoading },
  } = useForm({
    defaultValues,
    onSubmit,
    onSuccess: async () => undefined,
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

  const handleAmountChange = useCallback(
    (value: number) => {
      setHasManuallyChangedAmount(true)
      amountCtrl.field.onChange(value)
    },
    [amountCtrl.field],
  )

  // Validate that the entered amount does not exceed the available wallet balance.
  useEffect(() => {
    if (values.currency === 'CARD' || !values.amount || values.amount <= 0) {
      clearErrors('amount')
      return
    }

    const maxBalance =
      values.currency === 'USDC'
        ? (appState.connection.usdcBalance ?? 0)
        : values.currency === 'ETH'
          ? (appState.connection.ethBalance ?? 0)
          : (appState.connection.balance ?? 0)

    if (values.amount > maxBalance) {
      setError('amount', {
        type: 'manual',
        message: `Insufficient ${values.currency} balance`,
      })
    } else {
      clearErrors('amount')
    }
  }, [
    values.amount,
    values.currency,
    appState.connection.balance,
    appState.connection.ethBalance,
    appState.connection.usdcBalance,
    setError,
    clearErrors,
  ])

  // Recalculate token amount when currency changes (unless user has manually set the amount).
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

  // Reset and recalculate when modal opens. Balance is refreshed first so the
  // auto-selected currency reflects the user's actual wallet state.
  const isModalOpen = appState.ui.isTopUpCreditsModalOpen
  const isPrivyConnectionRef = useRef(isPrivyConnection)
  useEffect(() => {
    isPrivyConnectionRef.current = isPrivyConnection
  }, [isPrivyConnection])

  const prevIsModalOpenRef = useRef(isModalOpen)
  useEffect(() => {
    // Only run when modal transitions from closed → open
    if (!isModalOpen || prevIsModalOpenRef.current) {
      prevIsModalOpenRef.current = isModalOpen
      return
    }
    prevIsModalOpenRef.current = isModalOpen

    resetForm()

    const init = async () => {
      const freshBalances = await refreshBalance()
      const firstEnabled: PaymentCurrency = freshBalances
        ? pickFirstEnabledCurrency(
            freshBalances.balance,
            freshBalances.ethBalance,
            freshBalances.usdcBalance,
            isPrivyConnectionRef.current,
          )
        : defaultValues.currency

      setValue('currency', firstEnabled)
      lastCalculatedCurrencyRef.current = firstEnabled

      if (!creditManager) {
        setIsCalculatingInitialAmount(false)
        return
      }

      setIsCalculatingInitialAmount(true)
      try {
        const finalAmount = await calculateTokenAmountForCredits(
          firstEnabled,
          minimumCreditsNeeded,
        )
        setMinimumTokenAmount(finalAmount)
        setValue('amount', finalAmount)
      } catch (error) {
        console.error('Error calculating initial token amount:', error)
      } finally {
        setIsCalculatingInitialAmount(false)
      }
    }

    init()
  }, [
    isModalOpen,
    resetForm,
    refreshBalance,
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

      return await creditManager.getTokenToCreditsEstimation({
        ...values,
        currency: estimationCurrency(values.currency),
      })
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

  const bonus = estimation?.creditBonusAmount || 0
  const totalBalance = estimation?.creditAmount || 0

  const isBelowMinimumCredits = useMemo(() => {
    if (!estimation || isCalculatingInitialAmount || isLoadingEstimation)
      return false
    return estimation.creditAmount < minimumCreditsNeeded
  }, [
    estimation,
    isCalculatingInitialAmount,
    isLoadingEstimation,
    minimumCreditsNeeded,
  ])

  const showInsufficientWarning =
    hasManuallyChangedAmount && isBelowMinimumCredits

  const isSubmitDisabled = useMemo(() => {
    return (
      !values.amount ||
      values.amount <= 0 ||
      isSubmitLoading ||
      isCalculatingInitialAmount ||
      isBelowMinimumCredits ||
      !isEthereumNetwork ||
      !!errors.amount
    )
  }, [
    values.amount,
    isSubmitLoading,
    isCalculatingInitialAmount,
    isBelowMinimumCredits,
    isEthereumNetwork,
    errors.amount,
  ])

  const handleCardSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!creditManager) throw Err.ConnectYourWallet
      const sa = appState.connection.account?.address
      const eoa = appState.connection.eoaAddress
      if (!sa || !eoa || !values.amount) throw Err.ConnectYourWallet

      const { config } = await creditManager.createPrivyOnrampPayment(
        sa,
        eoa,
        values.amount,
      )

      // Force MoonPay widget — bypasses Privy's method-selection screen so the
      // user cannot accidentally do a wallet-to-wallet transfer.
      await fundWallet(config.address, {
        provider: 'moonpay',
        config: {
          quoteCurrencyAmount: Number(config.amount),
        },
      })
      // onUserExited handles modal close + processing state
    },
    [
      creditManager,
      appState.connection.account,
      appState.connection.eoaAddress,
      values.amount,
      fundWallet,
    ],
  )

  const unifiedHandleSubmit = useCallback(
    (e: React.FormEvent) => {
      if (values.currency === 'CARD') return handleCardSubmit(e)
      return handleSubmit(e)
    },
    [values.currency, handleCardSubmit, handleSubmit],
  )

  return {
    values,
    control,
    amountCtrl,
    currencyCtrl,
    errors,
    handleSubmit: unifiedHandleSubmit,
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
    isEthereumNetwork,
    getEthereumNetworkTooltip,
    isGasSponsored,
    isPrivyConnection,
    isOnrampProcessing,
    alephEnabled,
    ethEnabled,
    usdcEnabled,
    alephDisabledReason,
    ethDisabledReason,
    usdcDisabledReason,
    cardDisabledReason,
  }
}
