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
  connect: (
    caipChainId: string,
    pairing?: {
      topic: string
    },
  ) => Promise<void>
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
    await ethereumProvider.disconnect()
  }, [ethereumProvider])

  const connect = useCallback(
    async (chain: string) => {
      if (!ethereumProvider) {
        throw new Error('ethereumProvider is not initialized')
      }

      await ethereumProvider.connect({
        namespaces: {
          eip155: {
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_sign',
              'personal_sign',
              'eth_signTypedData',
              'wallet_addEthereumChain',
            ],
            chains: [chain],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {
              chainId: `https://rpc.walletconnect.com?chainId=${chain}&projectId=${!process
                .env.NEXT_PUBLIC_WALLET_CONNECT_ID}`,
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
        //relayUrl: DEFAULT_RELAY_URL,
      })

      const web3Modal = new Web3Modal({
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
        walletConnectVersion: 2,
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

  const sessionEventListener = (event: any) => {
    if (event.params?.event?.name === 'accountsChanged') {
      const chain = idToChain(event.params.chainId.split(':')[1])
      setSelectedNetwork(chain)
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
    [web3Modal],
  )
  
  useEffect(() => {
    if (ethereumProvider && web3Modal) {
      subscribeToEvents()

      return () => {
        ethereumProvider.off('display_uri', displayUriListener)
        ethereumProvider.off('session_event', sessionEventListener)
      }
    }
  }, [subscribeToEvents, ethereumProvider, web3Modal])

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
