import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
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

    await Promise.all([getBalance(account)]).catch((err) => {
      onError(err.message)
    })

    dispatch({ type: ActionTypes.connect, payload: { account } })
    return account
  }, [getBalance, dispatch, onError])

  // @todo: Think if it is necessary preload all on connect
  // useAccountProducts()

  const disconnect = useCallback(async () => {
    dispatch({ type: ActionTypes.disconnect, payload: null })
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
