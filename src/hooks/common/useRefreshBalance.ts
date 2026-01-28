import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { ConnectionSetBalanceAction } from '@/store/connection'
import { getAccountBalance } from '@/helpers/utils'
import { PaymentMethod } from '@/helpers/constants'

export type UseRefreshBalanceReturn = {
  refreshBalance: () => Promise<void>
}

export function useRefreshBalance(): UseRefreshBalanceReturn {
  const [state, dispatch] = useAppState()
  const { account } = state.connection

  const refreshBalance = useCallback(async () => {
    if (!account) return

    const { balance, creditBalance } = await getAccountBalance(
      account,
      PaymentMethod.Hold,
    )

    dispatch(new ConnectionSetBalanceAction({ balance, creditBalance }))
  }, [account, dispatch])

  return { refreshBalance }
}
