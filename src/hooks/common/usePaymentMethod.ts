import { useCallback, useEffect } from 'react'
import { useAppState } from '@/contexts/appState'
import { PaymentMethod } from '@/helpers/constants'
import { useRouter } from 'next/router'
import { ConnectionSetPaymentMethodAction, ConnectionSetBalanceAction } from '@/store/connection'
import { getAddressBalance } from '@/helpers/utils'
import { createFromEVMAccount, isAccountSupported } from '@aleph-sdk/superfluid'
import { EVMAccount } from '@aleph-sdk/evm'

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
export function usePaymentMethod(): UsePaymentMethodReturn {
  const [state, dispatch] = useAppState()
  const { paymentMethod } = state.connection
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
    const { account } = state.connection
    if (!account) return

    let balance: number | undefined

    try {
      if (paymentMethod === PaymentMethod.Stream && isAccountSupported(account)) {
        // For Stream payment method, fetch balance from RPC node
        const superfluidAccount = await createFromEVMAccount(account as EVMAccount)
        const superfluidBalance = await superfluidAccount.getALEPHBalance()
        balance = superfluidBalance.toNumber()
      } else {
        // For Hold payment method, fetch balance from pyaleph API
        balance = await getAddressBalance(account.address)
      }

      if (balance !== undefined) {
        dispatch(
          new ConnectionSetBalanceAction({
            balance,
          }),
        )
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }, [dispatch, paymentMethod, state.connection])

  // Auto-switch to "hold" when not in payment form
  useEffect(() => {
    const isPaymentForm = pathname.includes('/new') || pathname.endsWith('/new')
    
    if (!isPaymentForm && paymentMethod === PaymentMethod.Stream) {
      setPaymentMethod(PaymentMethod.Hold)
    }
  }, [pathname, paymentMethod, setPaymentMethod])

  // Update balance when payment method changes or account changes
  useEffect(() => {
    if (state.connection.account) {
      fetchBalance()
    }
  }, [fetchBalance, paymentMethod, state.connection.account])

  return {
    paymentMethod,
    setPaymentMethod,
    fetchBalance
  }
}