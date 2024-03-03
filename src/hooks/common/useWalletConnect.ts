import { useCallback, useEffect, useState } from 'react'
import { Web3Modal } from '@web3modal/standalone'
import UniversalProvider from '@walletconnect/universal-provider'
import { SessionTypes } from '@walletconnect/types'
import Client from '@walletconnect/sign-client'
import { web3Connect } from '@/helpers/aleph'
import { chainNameToEnum } from '../pages/useHeader'
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
  ethereumProvider: UniversalProvider
}

export const useWalletConnect = () => {
  const [_, dispatch] = useAppState()
  const { keepAccountAlive, getBalance, setSelectedNetwork } = useConnect()
  const [client, setClient] = useState<Client>()
  const [session, setSession] = useState<SessionTypes.Struct>()
  const [ethereumProvider, setEthereumProvider] = useState<UniversalProvider>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [hasCheckedPersistedSession, setHasCheckedPersistedSession] =
    useState(false)

  const disconnect = useCallback(async () => {
    if (typeof ethereumProvider === 'undefined') {
      throw new Error('ethereumProvider is not initialized')
    }
    await ethereumProvider.disconnect()

    setSession(undefined)
  }, [ethereumProvider])

  const displayUriListener = async (uri: string) => {
    console.log('EVENT', 'QR Code Modal open')
    web3Modal?.openModal({ uri })
  }

  const sessionPingListener = (event: any) => {
    console.log('session_ping', event)
  }

  const sessionEventListener = (event: any) => {
    console.log('session_event', event)
  }

  const sessionUpdateListener = async (event: any) => {
    console.log('session_update', event)
    setSession(event.session)
  }

  const sessionDeleteListener = (event: any) => {
    console.log('session_delete', event)
    setSession(undefined)
  }

  const _subscribeToProviderEvents = useCallback(
    async (_client: UniversalProvider) => {
      if (typeof _client === 'undefined') {
        throw new Error('WalletConnect is not initialized')
      }

      _client.on('display_uri', displayUriListener)
      _client.on('session_ping', sessionPingListener)
      _client.on('session_event', sessionEventListener)
      _client.on('session_update', sessionUpdateListener)
      _client.on('session_delete', sessionDeleteListener)
    },
    [web3Modal],
  )

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
      setClient(provider.client)
      setWeb3Modal(web3Modal)
    } catch (err) {
      throw err
    }
  }, [])

  const connect = useCallback(
    async (caipChainId: string, pairing?: { topic: string }) => {
      if (!ethereumProvider) {
        throw new ReferenceError('WalletConnect Client is not initialized.')
      }
      const chainId = caipChainId.split(':').pop()
      const session = await ethereumProvider.connect({
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
            chains: [`eip155:${chainId}`],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {
              chainId: `https://rpc.walletconnect.com?chainId=eip155:${chainId}&projectId=${!process
                .env.NEXT_PUBLIC_WALLET_CONNECT_ID}`,
            },
          },
        },
        pairingTopic: pairing?.topic,
      })

      await ethereumProvider.enable()
      setSession(session)

      web3Modal?.closeModal()
    },
    [ethereumProvider, web3Modal],
  )

  const onSessionConnected = useCallback(
    async (_session: SessionTypes.Struct) => {
      if (!ethereumProvider) {
        throw new ReferenceError('EthereumProvider is not initialized.')
      }
      const allNamespaceAccounts = Object.values(_session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()
      const chainData = allNamespaceAccounts[0].split(':')
      setSelectedNetwork(idToChain(Number(chainData[1])))
      setSession(_session)

      const account = await web3Connect(
        chainNameToEnum(chainData[1]),
        ethereumProvider,
      )
      dispatch({ type: ActionTypes.connect, payload: { account } })

      await Promise.all([getBalance(account)])
    },
    [ethereumProvider],
  )

  const _checkForPersistedSession = useCallback(
    async (provider: UniversalProvider) => {
      if (typeof provider === 'undefined') {
        throw new Error('WalletConnect is not initialized')
      }
      if (typeof session !== 'undefined') return
      if (ethereumProvider?.session) {
        const _session = ethereumProvider?.session
        await onSessionConnected(_session)
        return _session
      }
    },
    [session, ethereumProvider, onSessionConnected],
  )

  useEffect(() => {
    if (!client) {
      createClient()
    }
  }, [client])

  useEffect(() => {
    if (ethereumProvider && web3Modal) {
      _subscribeToProviderEvents(ethereumProvider)

      return () => {
        ethereumProvider.off('display_uri', displayUriListener)
        ethereumProvider.off('session_ping', sessionPingListener)
        ethereumProvider.off('session_event', sessionEventListener)
        ethereumProvider.off('session_update', sessionUpdateListener)
        ethereumProvider.off('session_delete', sessionDeleteListener)
      }
    }
  }, [_subscribeToProviderEvents, ethereumProvider, web3Modal])

  useEffect(() => {
    const getPersistedSession = async () => {
      if (!ethereumProvider) return
      await _checkForPersistedSession(ethereumProvider)
      setHasCheckedPersistedSession(true)
    }
    if (ethereumProvider && !hasCheckedPersistedSession && keepAccountAlive) {
      getPersistedSession()
    }
  }, [
    ethereumProvider,
    _checkForPersistedSession,
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
