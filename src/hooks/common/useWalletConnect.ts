import { useCallback, useEffect, useState } from 'react'
import { Web3Modal } from '@web3modal/standalone'
import UniversalProvider from '@walletconnect/universal-provider'
import { web3Connect } from '@/helpers/aleph'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { ProviderEnum, idToChain, useConnect } from './useConnect'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'

export type WalletConnectReturn = {
  isWalletConnect: boolean
  disconnect: () => Promise<void>
  connect: (chain: string) => Promise<void>
  switchNetwork: (chain: string) => Promise<void>
  ethereumProvider?: UniversalProvider
}

export const useWalletConnect = () => {
  const [_, dispatch] = useAppState()
  const { account, isConnected, currentProvider, getBalance, selectedNetwork, setSelectedNetwork } = useConnect()
  const [ethereumProvider, setEthereumProvider] = useState<UniversalProvider>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()

  const switchNetwork = useCallback(async (chain: Chain) => {
    if (!ethereumProvider) {
      throw new Error('ethereumProvider is not initialized')
    }
    ethereumProvider.setDefaultChain(`eip155:${{chain}}`)
    const account = await web3Connect(chain, ethereumProvider)
    setSelectedNetwork(chain)
    dispatch({ type: ActionTypes.connect, payload: { account } })
    await getBalance(account)
  }, [ethereumProvider])

  const disconnect = useCallback(async () => {
    if (!ethereumProvider) {
      throw new Error('ethereumProvider is not initialized')
    }
    if (ethereumProvider.session) {
      await ethereumProvider.disconnect()
    }
  }, [ethereumProvider])

  const connect = useCallback(
    async (chain: string) => {
      if (!ethereumProvider) {
        throw new Error('ethereumProvider is not initialized')
      }

      const methods = [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
        'wallet_addEthereumChain',
      ]
      const events = ['chainChanged', 'accountsChanged']
      await ethereumProvider.connect({
        namespaces: {
          eip155: {
            methods,
            events,
            chains: ['eip155:1'],
            rpcMap: {
              ['eip155:1']: `https://rpc.walletconnect.com?chainId=eip155:1&projectId=${!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID}`,
            },
          },
        },
        optionalNamespaces: {
          eip155: {
            methods,
            events,
            chains: ['eip155:43114'],
            rpcMap: {
              ['eip155:43114']: `https://rpc.walletconnect.com?chainId=eip155:43114&projectId=${!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID}`,
            },
          },
        },
      })
      ethereumProvider.setDefaultChain(`eip155:${{chain}}`)
      await ethereumProvider.enable()

      web3Modal?.closeModal()
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
        }
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
  
  const sessionEventListener = useCallback(async (event: any) => {
    if (event.params?.event?.name === 'chainChanged') {
      await switchNetwork(idToChain(event.params?.event?.data))
    }
  }, [ethereumProvider, setSelectedNetwork, dispatch]); 

  const subscribeToEvents = useCallback(async () => {
    if (!ethereumProvider) {
      throw new Error('ethereumProvider is not initialized')
    }
  
    ethereumProvider.on('display_uri', displayUriListener)
    ethereumProvider.on('session_event', sessionEventListener)
  }, [ethereumProvider, displayUriListener, sessionEventListener])  
  
  useEffect(() => {
    if (ethereumProvider) {
      subscribeToEvents()

      return () => {
        ethereumProvider.off('display_uri', displayUriListener)
        ethereumProvider.off('session_event', sessionEventListener)
      }
    }
  }, [subscribeToEvents, ethereumProvider])

  // session management

  const enableConnection = useCallback(async () => {
    if (!ethereumProvider || isConnected) return
    if (ethereumProvider.session) {
      const account = await web3Connect(selectedNetwork, ethereumProvider)
      dispatch({ type: ActionTypes.connect, payload: { account } })
      await Promise.all([getBalance(account)])
    }
  }, [ethereumProvider, isConnected, selectedNetwork, dispatch])  

  useEffect(() => {
    ;(async () => {
      if (!account && currentProvider === ProviderEnum.WalletConnect) {
        enableConnection()
      }
    })()
  }, [account, currentProvider, enableConnection])

  return {
    isWalletConnect: true,
    disconnect,
    connect,
    switchNetwork,
    ethereumProvider,
  }
}
