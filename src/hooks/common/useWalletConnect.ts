import { useCallback, useEffect, useState } from 'react'
import { Web3Modal } from '@web3modal/standalone'
import UniversalProvider from '@walletconnect/universal-provider'
import { web3Connect } from '@/helpers/aleph'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { idToChain, useConnect } from './useConnect'

export type WalletConnectReturn = {
  isWalletConnect: boolean
  disconnect: () => Promise<void>
  connect: () => Promise<void>
  ethereumProvider?: UniversalProvider
}

export const useWalletConnect = () => {
  const [_, dispatch] = useAppState()
  const { keepAccountAlive, getBalance, selectedNetwork, setSelectedNetwork } = useConnect()
  const [ethereumProvider, setEthereumProvider] = useState<UniversalProvider>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [hasCheckedPersistedSession, setHasCheckedPersistedSession] =
    useState(false)

  const disconnect = useCallback(async () => {
    if (!ethereumProvider) {
      throw new Error('ethereumProvider is not initialized')
    }
    if (ethereumProvider.session) {
      await ethereumProvider.disconnect()
    }
  }, [ethereumProvider])

  const connect = useCallback(
    async () => {
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

  const displayUriListener = async (uri: string) => {
    web3Modal?.openModal({ uri })
  }

  const sessionEventListener = async (event: any) => {
    // in case the user has a different network in the mobile
    // the state is updated in the initialization also
    if (event.params?.event?.name === 'chainChanged') {
      const chain = idToChain(event.params?.event?.data)
      const account = await web3Connect(chain, ethereumProvider)
      setSelectedNetwork(chain)
      dispatch({ type: ActionTypes.connect, payload: { account } })
      await Promise.all([getBalance(account)])
    }
  }

  const subscribeToEvents = useCallback(
    async () => {
      if (!ethereumProvider) {
        throw new Error('ethereumProvider is not initialized')
      }

      ethereumProvider.on('display_uri', displayUriListener)
      ethereumProvider.on('session_event', sessionEventListener)
    },
    [web3Modal, selectedNetwork],
  )
  
  useEffect(() => {
    if (ethereumProvider && web3Modal) {
      subscribeToEvents()

      return () => {
        ethereumProvider.off('display_uri', displayUriListener)
        ethereumProvider.off('session_event', sessionEventListener)
      }
    }
  }, [subscribeToEvents, ethereumProvider, web3Modal, selectedNetwork])

  // session management

  const checkPersistedSession = async () => {
    if (!ethereumProvider) return
    const account = await web3Connect(
      selectedNetwork,
      ethereumProvider,
    )
    dispatch({ type: ActionTypes.connect, payload: { account } })
    await Promise.all([getBalance(account)])
    setHasCheckedPersistedSession(true)
  }

  useEffect(() => {
    if (ethereumProvider && !hasCheckedPersistedSession && keepAccountAlive) {
      checkPersistedSession()
    }
  }, [
    ethereumProvider,
    hasCheckedPersistedSession,
    keepAccountAlive,
  ])

  return {
    isWalletConnect: true,
    disconnect,
    connect,
    ethereumProvider,
  }
}
