import { useAppState } from '@/contexts/appState'
import {
  getAccountBalance,
  getAccountFileStats,
  getAccountProducts,
  web3Connect,
} from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/aleph-core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { useCallback } from 'react'

export type UseConnectReturn = {
  connect: () => Promise<Account | undefined>
  disconnect: () => Promise<void>
  isConnected: boolean
  account: Account | undefined
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
  const noti = useNotification()

  const onError = useCallback(
    (error: string) => {
      noti &&
        noti.add({
          variant: 'error',
          title: 'Error',
          text: error,
        })
    },
    [noti],
  )

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

  const getFileStats = useCallback(
    async (account: any) => {
      const accountFiles = await getAccountFileStats(account)
      dispatch({ type: ActionTypes.setAccountFiles, payload: { accountFiles } })
    },
    [dispatch],
  )

  const connect = useCallback(async () => {
    let account
    try {
      account = await web3Connect(Chain.ETH, window?.ethereum)
    } catch (err) {
      onError('You need an Ethereum wallet to use Aleph.im.')
    }

    if (!account) return

    await Promise.all([
      getBalance(account),
      getProducts(account),
      getFileStats(account),
    ]).catch((err) => {
      onError(err.message)
    })

    dispatch({ type: ActionTypes.connect, payload: { account } })
    return account
  }, [getBalance, getProducts, getFileStats, dispatch, onError])

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
