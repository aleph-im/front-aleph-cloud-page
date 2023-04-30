import { useAppState } from '@/contexts/appState'
import {
  getAccountBalance,
  getAccountProducts,
  web3Connect,
} from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/message'
import { useCallback } from 'react'

export type UseConnectReturn = {
  connect: () => Promise<Account | undefined>
  disconnect: () => Promise<void>
  isConnected: boolean
  account: Account | undefined
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()

  const getBalance = useCallback(
    async (account: any) => {
      const balance = await getAccountBalance(account)
      dispatch({ type: ActionTypes.setAccountBalance, payload: { balance } })
    },
    [dispatch],
  )

  const getProducts = useCallback(
    async (account: any) => {
      const products = await getAccountProducts(account)
      dispatch({ type: ActionTypes.setProducts, payload: { products } })
    },
    [dispatch],
  )

  const connect = useCallback(async () => {
    const account = await web3Connect(Chain.ETH, window?.ethereum)
    dispatch({ type: ActionTypes.connect, payload: { account } })

    await getBalance(account)
    await getProducts(account)

    return account
  }, [dispatch, getBalance, getProducts])

  const disconnect = useCallback(async () => {
    dispatch({ type: ActionTypes.disconnect })
  }, [dispatch])

  const { account } = state
  const isConnected = !!account?.address

  return {
    connect,
    disconnect,
    isConnected,
    account,
  }
}
