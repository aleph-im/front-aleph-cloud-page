import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/aleph-core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { useCallback } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import { useHelia } from './useHelia'

export type UseConnectReturn = {
  connect: () => Promise<Account | undefined>
  disconnect: () => Promise<void>
  isConnected: boolean
  account: Account | undefined
  tryReconnect: () => Promise<void>
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
  const { fs } = useHelia()
  const noti = useNotification()
  const [keepAccountAlive, setKeepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )

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
    async (account: Account) => {
      const balance = await getAccountBalance(account)
      dispatch({ type: ActionTypes.setAccountBalance, payload: { balance } })
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
    setKeepAccountAlive(true)

    await Promise.all([getBalance(account)]).catch((err) => {
      onError(err.message)
    })

    dispatch({ type: ActionTypes.connect, payload: { account, fs } })

    return account
  }, [setKeepAccountAlive, getBalance, dispatch, onError])

  const disconnect = useCallback(async () => {
    setKeepAccountAlive(false)
    dispatch({ type: ActionTypes.disconnect, payload: null })
  }, [dispatch, setKeepAccountAlive])

  const { account } = state
  const isConnected = !!account?.address

  const tryReconnect = useCallback(async () => {
    if (isConnected || !keepAccountAlive) return
    await connect()
  }, [isConnected, keepAccountAlive, connect])

  return {
    connect,
    disconnect,
    isConnected,
    account,
    tryReconnect,
  }
}
