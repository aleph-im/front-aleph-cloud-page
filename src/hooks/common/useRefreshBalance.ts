import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import {
  selectDisplayAddress,
  ConnectionRefreshBalancesAction,
} from '@/store/connection'
import { fetchOnChainBalances, OnChainBalances } from '@/helpers/utils'

export function useRefreshBalance(): () => Promise<
  OnChainBalances | undefined
> {
  const [state, dispatch] = useAppState()

  return useCallback(async () => {
    const address = selectDisplayAddress(state.connection)
    const { blockchain } = state.connection

    if (!address || !blockchain) return undefined

    const balances = await fetchOnChainBalances(address, blockchain)
    dispatch(new ConnectionRefreshBalancesAction(balances))
    return balances
  }, [state.connection, dispatch])
}
