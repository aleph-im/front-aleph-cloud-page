import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/aleph-core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { useCallback } from 'react'
import { useSessionStorage } from 'usehooks-ts'

export type UseConnectReturn = {
  connect: (chain?: Chain) => Promise<Account | undefined>
  disconnect: () => Promise<void>
  isConnected: boolean
  account: Account | undefined
  tryReconnect: () => Promise<void>
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
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

  const connect = useCallback(async (chain: Chain = Chain.ETH) => {
    let account
    try {
      // @todo: Needs to accommodate for other non-evm chains
      account = await web3Connect(chain, window.ethereum)
    } catch (err) {
      onError(err.message)
    }

    if (!account) return
    setKeepAccountAlive(true)

    await Promise.all([getBalance(account)]).catch((err) => {
      onError(err.message)
    })

    dispatch({ type: ActionTypes.connect, payload: { account } })

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
