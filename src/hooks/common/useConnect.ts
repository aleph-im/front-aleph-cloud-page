import { useAppState } from '@/contexts/appState'
import { getAccountBalance, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { useNotification } from '@aleph-front/core'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import { useWalletConnect } from '@/contexts/walletConnect'

export type UseConnectReturn = {
  connect: (chain?: Chain, provider?: any) => Promise<Account | undefined>
  onSessionConnect: (chain: Chain, provider: any) => Promise<Account | undefined>
  disconnect: () => Promise<void>
  switchNetwork: (chain?: Chain, provider?: any) => Promise<Account | undefined>
  getBalance: (account: Account) => Promise<void>
  isConnected: boolean
  account: Account | undefined
  selectedNetwork: Chain
  setSelectedNetwork: Dispatch<SetStateAction<Chain>>
  currentProvider: ProviderEnum
}

type NotificationCardVariant = 'error' | 'success' | 'warning'

export enum ProviderEnum {
  Metamask = "Metamask",
  WalletConnect = "WalletConnect",
  Disconnected = "DisconnectState",
}

export function useConnect(): UseConnectReturn {
  const [state, dispatch] = useAppState()
  const walletConnect = useWalletConnect()
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

  const onSessionConnect = useCallback(
    async (chain: Chain, provider: any) => {
      const account = await web3Connect(chain, provider)
      if (!account) return
      
      dispatch({ type: ActionTypes.connect, payload: { account } })
      getBalance(account)
      setSelectedNetwork(chain)
      setCurrentProvider(provider.isWalletConnect ? 
        ProviderEnum.WalletConnect : ProviderEnum.Metamask)

      return account
    },
    [dispatch, getBalance, setSelectedNetwork, setCurrentProvider]
  )

  const connect = useCallback(
    async (chain?: Chain, provider?: any) => {
      if (!chain) return
      if (!provider) provider = window.ethereum

      let account

      try {
        if (provider?.isWalletConnect) {
          account = await provider.connect(chain)

          if (!account) return
        } else {
          account = onSessionConnect(chain, provider)
        }
        if (!account) return
      } catch (err) {
        const e = err as Error
        onNoti(e.message, 'error') // we assume because the user denied the connection
      }
  
      return account
    },
    [onSessionConnect, onNoti],
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
      if (!chain) return
      if (!provider) provider = currentProvider === ProviderEnum.Metamask ? 
        window.ethereum : walletConnect

      let account
      try {
        if (provider?.isWalletConnect) {
          account = await provider.switchNetwork(chain)
        } else {
          account = await onSessionConnect(chain, provider)
        }
        if (!account) return
      } catch (err) {
        console.log(err)
        const e = err as Error
        onNoti(e.message, 'error')
      }
      return account
    },
    [onSessionConnect, walletConnect, currentProvider, setSelectedNetwork, setCurrentProvider, onNoti],
  )

  const { account } = state
  const isConnected = !!account?.address

  return {
    connect,
    onSessionConnect,
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
