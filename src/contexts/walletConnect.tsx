import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useConnect, idToChain, ProviderEnum, chainToId } from '@/hooks/common/useConnect'
import UniversalProvider from '@walletconnect/universal-provider'
import { Web3Modal } from '@web3modal/standalone'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import Provider from '@walletconnect/universal-provider'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'

export type WalletConnect = {
  isWalletConnect: boolean
  disconnect: () => Promise<void>
  connect: (chain: Chain) => Promise<Account | undefined>
  switchNetwork: (chain: Chain) => Promise<Account | undefined>
  ethereumProvider?: UniversalProvider
}

export const WalletConnectContext = createContext<WalletConnect | null>(null)

export const WalletConnectProvider = ({ children }: { children: ReactNode }) => {
  const { currentProvider, onSessionConnect, isConnected, selectedNetwork } = useConnect()
  const [ethereumProvider, setEthereumProvider] = useState<UniversalProvider>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()

  const switchNetwork = useCallback(async (chain: Chain) => {
    if (!ethereumProvider) {
      throw new Error('ethereumProvider is not initialized')
    }
    if (!ethereumProvider.session) {
      throw new Error('session is not initialized')
    }

    await ethereumProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: `0x${chainToId(chain).toString(16)}`}]
    })

    return await onSessionConnect(chain, ethereumProvider)
  }, [ethereumProvider, onSessionConnect])

  const disconnect = useCallback(async () => {
    if (!ethereumProvider) {
      throw new Error('ethereumProvider is not initialized')
    }
    await ethereumProvider.disconnect()
  }, [ethereumProvider])

  const connect = useCallback(
    async (chain: Chain): Promise<Account | undefined> => {
      if (!ethereumProvider || !web3Modal) {
        throw new Error('ethereumProvider is not initialized')
      }

      const methods = [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
        'wallet_addEthereumChain',
        'wallet_switchEthereumChain'
      ]
      const mainChain = chain === Chain.AVAX ? `eip155:43114` : `eip155:1`
      const optionalChain = chain === Chain.AVAX ? `eip155:1` : `eip155:43114`
      const events = ["chainChanged", "accountsChanged"]
      await ethereumProvider.connect({ 
        namespaces: {
          eip155: {
            methods,
            chains: [mainChain],
            events,
          },
        },
        optionalNamespaces: {
          eip155: {
            methods,
            chains: [optionalChain],
            events,
          },
        }
       })

      await ethereumProvider.enable()
      web3Modal?.closeModal()

      return await onSessionConnect(chain, ethereumProvider)
    },
    [ethereumProvider, web3Modal],
  )

  // provider initialization

  const createClient = useCallback(async () => {
    try {
      if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID) return

      const provider = await UniversalProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
        logger: 'debug',
        metadata: {
          name: 'Aleph.im',
          description: 'Aleph.im: Web3 cloud solution',
          url: 'https://aleph.im/',
          icons: []
        },
      })

      const web3Modal = new Web3Modal({
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
        walletConnectVersion: 2,
        //mobileWallets: []
      })

      setEthereumProvider(provider)
      setWeb3Modal(web3Modal)
    } catch (err) {
      throw err
    }
  }, [])

  useEffect(() => {
    if (!ethereumProvider) {
      createClient()
    }
  }, [ethereumProvider])

  // setup - clean-up listeners
  
  const displayUriListener = useCallback(async (uri: string) => {
    web3Modal?.openModal({ uri })
  }, [web3Modal])

  const sessionDeleteListener = useCallback(async () => {
    await disconnect()
  }, [disconnect])
  
  const sessionEventListener = useCallback(async (event: any) => {
    console.log("EVENT", "session_update", event)

    if (!ethereumProvider?.session) return        
    if (event.params?.event?.name === 'chainChanged') {
      await onSessionConnect(idToChain(event.params?.event?.data), ethereumProvider)
    }
  }, [onSessionConnect, ethereumProvider])

  const subscribeToEvents = useCallback(
    async (provider: Provider) => {
      if (typeof provider === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }

      provider.on("display_uri", displayUriListener)
      provider.on("session_update", sessionEventListener)
      provider.on("session_delete", sessionDeleteListener)
    },
    [displayUriListener, sessionEventListener, sessionDeleteListener]
  )
  
  useEffect(() => {
    if (ethereumProvider) {
      subscribeToEvents(ethereumProvider)

      return () => {
        ethereumProvider.off('display_uri', displayUriListener)
        ethereumProvider.off('session_update', displayUriListener)
        ethereumProvider.off('session_delete', sessionDeleteListener)
      }
    }
  }, [ethereumProvider, subscribeToEvents])

  // auto-login wallet connect

  const enableConnection = useCallback(async () => {
    if (!ethereumProvider) return
    if (ethereumProvider.session && !isConnected && currentProvider === ProviderEnum.WalletConnect) {
      await onSessionConnect(selectedNetwork, ethereumProvider)
    }
  }, [ethereumProvider, currentProvider, selectedNetwork, onSessionConnect])
  
  useEffect(() => {
    enableConnection()
  }, [ethereumProvider])
  
  const value = useMemo(
    () => ({
      isWalletConnect: true,
      disconnect,
      connect,
      switchNetwork,
      ethereumProvider,
    }),
    [
      disconnect,
      connect,
      switchNetwork,
      ethereumProvider,
    ]
  )

  return (
    <WalletConnectContext.Provider value={{...value}}>
      {children}
    </WalletConnectContext.Provider>
  )
}

export function useWalletConnect(): WalletConnect| null {
  const context = useContext(WalletConnectContext)
  if (context === undefined) {
    throw new Error(
      "useWalletConnectClient must be used within a ClientContextProvider"
    )
  }
  return context
}