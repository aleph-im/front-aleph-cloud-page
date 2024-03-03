import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import { WalletConnectReturn } from './useWalletConnect'
import { ethers } from 'ethers'
import Provider from '@walletconnect/universal-provider'

export type Providers = ethers.providers.ExternalProvider | Provider

export type UseConnectReturn = {
  connect: (
    chain?: Chain,
    provider?: Providers,
  ) => Promise<Account | undefined>
  disconnect: () => Promise<void>
  switchNetwork: (chain: Chain) => Promise<Account | undefined>
  getBalance: (account: Account) => Promise<void>
  isConnected: boolean
  account: Account | undefined
  selectedNetwork: Chain
  setSelectedNetwork: Dispatch<SetStateAction<Chain>>
  keepAccountAlive: boolean
}

type NotificationCardVariant = 'error' | 'success' | 'warning'

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
  const [currentProvider, setCurrentProvider] =
    useState<null | WalletConnectReturn>(null)

  const onNoti = useCallback(
    (error: string, variant: NotificationCardVariant) => {
      noti &&
        noti.add({
          variant,
          title: variant.charAt(0).toUpperCase() + variant.slice(1),
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
    async (chain?: Chain, provider?: any) => {
      if (!chain) return
      let account

      try {
        if (provider && provider.isWalletConnect) {
          await provider.connect(`eip155:${chainToId(chain)}`)
          setCurrentProvider(provider)
          account = await web3Connect(chain, provider.ethereumProvider)
        } else {
          account = await web3Connect(chain, provider)
        }
        // else if (!provider && window.web3) {
        //   provider = window.web3.currentProvider
        // } else if (!provider && window.solana) {
        //   provider = window.solana
        // }
        if (!account) return

        setKeepAccountAlive(true)
        setSelectedNetwork(chain)

        dispatch({ type: ActionTypes.connect, payload: { account } })

        await Promise.all([getBalance(account)])
      } catch (err) {
        console.log(err)
        const e = err as Error
        onNoti(e.message, 'error') // we assume because the user denied the connection
      }

      return account
    },
    [setKeepAccountAlive, getBalance, dispatch, onNoti],
  )

  const disconnect = useCallback(async () => {
    setKeepAccountAlive(false)
    if (currentProvider) {
      await currentProvider.disconnect()
      setCurrentProvider(null)
    }
    dispatch({ type: ActionTypes.disconnect, payload: null })
  }, [dispatch, setKeepAccountAlive])

  const switchNetwork = useCallback(
    async (chain: Chain, provider?: Providers) => {
      let account

      if (!provider) provider = window.ethereum
      try {
        account = await web3Connect(chain, provider)
        setSelectedNetwork(chain)
        await Promise.all([getBalance(account)])
      } catch (err) {
        const e = err as Error
        onNoti(`Error during network switch: ${e.message}`, 'error')
      }

      dispatch({ type: ActionTypes.connect, payload: { account } })

      return account
    },
    [dispatch, getBalance, onNoti, setSelectedNetwork],
  )

  const { account } = state
  const isConnected = !!account?.address

  return {
    connect,
    disconnect,
    switchNetwork,
    isConnected,
    account,
    selectedNetwork,
    setSelectedNetwork,
    keepAccountAlive,
    getBalance,
  }
}

// todo: get useHeader helpers and improve this also
export function chainToId(chain: Chain): number {
  switch (chain) {
    case Chain.ETH:
      return 1
    case Chain.AVAX:
      return 43114
    default:
      return 1
  }
}

export function idToChain(chain: number): Chain {
  switch (chain) {
    case 1:
      return Chain.ETH
    case 43114:
      return Chain.AVAX
    default:
      return Chain.ETH
  }
}
