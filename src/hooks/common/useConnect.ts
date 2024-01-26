import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { useCallback, useState } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import { ExternalProvider } from '@ethersproject/providers'

export type UseConnectReturn = {
  connect: (
    chain?: Chain,
    provider?: ExternalProvider,
  ) => Promise<Account | undefined>
  disconnect: () => Promise<void>
  isConnected: boolean
  account: Account | undefined
  tryReconnect: () => Promise<void>
  switchNetwork: (chain: Chain) => Promise<Account | undefined>
  selectedNetwork: Chain
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
  const noti = useNotification()
  const [keepAccountAlive, setKeepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )
  const [selectedNetwork, setSelectedNetwork] = useSessionStorage<Chain>(
    'selectedNetwork',
    Chain.ETH,
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

  const connect = useCallback(
    async (chain?: Chain, provider?: ExternalProvider) => {
      let account
      try {
        if (chain) {
          setSelectedNetwork(chain)
        } else {
          chain = selectedNetwork
        }
        if (!provider && window.ethereum) {
          provider = window.ethereum
        } else if (!provider && window.web3) {
          provider = window.web3.currentProvider
        } else if (!provider && window.solana) {
          provider = window.solana
        }
        account = await web3Connect(chain, provider)
      } catch (err) {
        onError(err.message) // we assume because the user denied the connection
        // @todo: remove ugly hack because of weird selectedNetwork behavior
        try {
          if (chain === Chain.ETH) {
            account = await web3Connect(Chain.AVAX, provider)
            setSelectedNetwork(Chain.AVAX)
          } else {
            account = await web3Connect(Chain.ETH, provider)
            setSelectedNetwork(Chain.ETH)
          }
        } catch (err) {
          onError(err.message) // we got fucked
        }
      }
      if (!account) return
      setKeepAccountAlive(true)

      await Promise.all([getBalance(account)]).catch((err) => {
        onError(err.message)
      })

      dispatch({ type: ActionTypes.connect, payload: { account } })

      return account
    },
    [setKeepAccountAlive, getBalance, dispatch, onError],
  )

  const disconnect = useCallback(async () => {
    setKeepAccountAlive(false)
    dispatch({ type: ActionTypes.disconnect, payload: null })
  }, [dispatch, setKeepAccountAlive])

  const switchNetwork = useCallback(
    async (chain: Chain) => {
      return await connect(chain)
    },
    [connect, setSelectedNetwork],
  )

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
    switchNetwork,
    selectedNetwork,
  }
}
