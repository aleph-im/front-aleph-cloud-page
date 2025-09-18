import { useCallback, useEffect } from 'react'
import { useAppState } from '@/contexts/appState'
import { PaymentMethod } from '@/helpers/constants'
import { useRouter } from 'next/router'
import {
  ConnectionSetBalanceAction,
  ConnectionSetPaymentMethodAction,
} from '@/store/connection'
import { getAccountBalance } from '@/helpers/utils'

export type UsePaymentMethodProps = {
  triggerOnMount?: boolean
}

export type UsePaymentMethodReturn = {
  paymentMethod: PaymentMethod
  setPaymentMethod: (method: PaymentMethod) => void
  fetchBalance: () => Promise<void>
}

/**
 * Hook to manage payment method globally
 * It will:
 * 1. Return current payment method from the store
 * 2. Provide a setter for updating it
 * 3. Automatically set payment method to "hold" when not in payment form
 * 4. Update the balance based on the selected payment method
 */
export function usePaymentMethod({
  triggerOnMount = false,
}: UsePaymentMethodProps = {}): UsePaymentMethodReturn {
  const [state, dispatch] = useAppState()
  const { paymentMethod, account } = state.connection
  const router = useRouter()
  const { pathname } = router

  // Set payment method in the store
  const setPaymentMethod = useCallback(
    (method: PaymentMethod) => {
      dispatch(
        new ConnectionSetPaymentMethodAction({
          paymentMethod: method,
        }),
      )
    },
    [dispatch],
  )

  // Fetch balance based on the current payment method
  const fetchBalance = useCallback(async () => {
    if (!account) return

    try {
      const { balance, creditBalance } = await getAccountBalance(
        account,
        paymentMethod,
      )

      if (balance !== undefined || creditBalance !== undefined) {
        dispatch(new ConnectionSetBalanceAction({ balance, creditBalance }))
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }, [account, paymentMethod, dispatch])

  // Auto-switch to "hold" when not in payment form
  useEffect(() => {
    const isPaymentForm = pathname.includes('/new') || pathname.endsWith('/new')

    if (!isPaymentForm && paymentMethod === PaymentMethod.Stream) {
      setPaymentMethod(PaymentMethod.Hold)
    }
  }, [pathname, paymentMethod, setPaymentMethod])

  // Fetch balance when account changes
  useEffect(() => {
    if (!triggerOnMount) return
    if (!account) return
    fetchBalance()
  }, [account, paymentMethod, fetchBalance, triggerOnMount])

  return {
    paymentMethod,
    setPaymentMethod,
    fetchBalance,
  }
}
