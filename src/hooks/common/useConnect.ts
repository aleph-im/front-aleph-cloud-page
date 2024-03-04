import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { Dispatch, SetStateAction, useCallback, useContext, useState } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import { ethers } from 'ethers'
import { WalletConnectContext } from '@/contexts/walletConnect'
import { WalletConnectReturn } from './useWalletConnect'

export type Providers = ethers.providers.ExternalProvider | WalletConnectReturn

export type UseConnectReturn = {
  connect: (chain?: Chain, provider?: Providers) => Promise<Account | undefined>
  disconnect: () => Promise<void>
  switchNetwork: (chain?: Chain, provider?: Providers) => Promise<Account | undefined>
  getBalance: (account: Account) => Promise<void>
  isConnected: boolean
  account: Account | undefined
  selectedNetwork: Chain
  setSelectedNetwork: Dispatch<SetStateAction<Chain>>
  currentProvider: ProviderEnum
}

type NotificationCardVariant = 'error' | 'success' | 'warning'

export enum ProviderEnum {
  Ethereum = "Ethereum",
  WalletConnect = "WalletConnect",
  Disconnected = "DisconnectState",
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
  const walletConnect = useContext(WalletConnectContext)
  const noti = useNotification()
  const [selectedNetwork, setSelectedNetwork] = useSessionStorage<Chain>(
    'selectedNetwork',
    Chain.ETH,
  )
  const [currentProvider, setCurrentProvider] = useSessionStorage<ProviderEnum>(
    'currentProvider',
    ProviderEnum.Disconnected
  )
    
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
      if (!chain) chain = selectedNetwork
      if (!provider) {
        provider = currentProvider === ProviderEnum.WalletConnect ?
          walletConnect : window.ethereum 
      } 

      let account
      try {
        if (provider.isWalletConnect) {
          setCurrentProvider(ProviderEnum.WalletConnect)
          await provider.connect(chainToId(chain).toString())
          account = await web3Connect(chain, provider.ethereumProvider)
        } else {
          setCurrentProvider(ProviderEnum.Ethereum)
          account = await web3Connect(chain, provider)
        }
        if (!account) return

        setSelectedNetwork(chain)
        dispatch({ type: ActionTypes.connect, payload: { account } })
        getBalance(account)
      } catch (err) {
        console.log(err)
        const e = err as Error
        onNoti(e.message, 'error') // we assume because the user denied the connection
      }

      return account
    },
    [currentProvider, selectedNetwork, dispatch, setCurrentProvider, getBalance, onNoti]
  )

  const disconnect = useCallback(async () => {
    if (currentProvider === ProviderEnum.WalletConnect) {
      walletConnect?.disconnect()
    }
    
    setCurrentProvider(ProviderEnum.Disconnected)

    dispatch({ type: ActionTypes.disconnect, payload: null })
  }, [dispatch, currentProvider, walletConnect])

  const switchNetwork = useCallback(
    async (chain?: Chain, provider?: any) => {
      if (!chain) chain = selectedNetwork
      if (!provider) {
        provider = currentProvider === ProviderEnum.WalletConnect ?
          walletConnect?.ethereumProvider : window.ethereum 
      } 

      let account
      try {
        if (provider.isWalletConnect) {
          await provider.switchNetwork(chainToId(chain).toString())
          account = await web3Connect(chain, provider.ethereumProvider)
        } else {
          account = await web3Connect(chain, provider)
        }
        if (!account) return

        setSelectedNetwork(chain)
        dispatch({ type: ActionTypes.connect, payload: { account } })
        getBalance(account)
      } catch (err) {
        console.log(err)
        const e = err as Error
        onNoti(e.message, 'error') // we assume because the user denied the connection
      }

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
    getBalance,
    currentProvider
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
