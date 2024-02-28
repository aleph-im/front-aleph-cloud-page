import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Web3Modal } from '@web3modal/standalone'
import UniversalProvider from '@walletconnect/universal-provider'
import { PairingTypes, SessionTypes } from '@walletconnect/types'
import Client from '@walletconnect/sign-client'
import { providers } from 'ethers'
import { web3Connect } from '@/helpers/aleph'
import { chainNameToEnum } from '../pages/useHeader'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useConnect } from './useConnect'

export type WalletConnectReturn = {
  isWalletConnect: boolean
  disconnect: () => Promise<void>
  chain: string
  connect: (caipChainId: string, pairing?: {
    topic: string;
  }) => Promise<void>
  ethereumProvider: UniversalProvider
}

export const useWalletConnect = () => {
  const [state, dispatch] = useAppState()
  const { keepAccountAlive, getBalance } = useConnect()
  const [client, setClient] = useState<Client>()
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([])
  const [session, setSession] = useState<SessionTypes.Struct>()

  const [ethereumProvider, setEthereumProvider] = useState<UniversalProvider>()
  const [web3Provider, setWeb3Provider] = useState<providers.Web3Provider>()

  const [hasCheckedPersistedSession, setHasCheckedPersistedSession] =
    useState(false)

  const [accounts, setAccounts] = useState<string[]>([])
  const [chain, setChain] = useState<string>('')
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()

  const resetApp = () => {
    setPairings([])
    setSession(undefined)
    setAccounts([])
    setChain('')
  }

  const disconnect = useCallback(async () => {
    if (typeof ethereumProvider === 'undefined') {
      throw new Error('ethereumProvider is not initialized')
    }
    await ethereumProvider.disconnect()

    resetApp()
  }, [ethereumProvider])

  const _subscribeToProviderEvents = useCallback(
    async (_client: UniversalProvider) => {
      if (typeof _client === 'undefined') {
        throw new Error('WalletConnect is not initialized')
      }

      _client.on('display_uri', async (uri: string) => {
        console.log('EVENT', 'QR Code Modal open')
        web3Modal?.openModal({ uri })
      })

      // Subscribe to session ping
      _client.on(
        'session_ping',
        ({ id, topic }: { id: number; topic: string }) => {
          console.log('EVENT', 'session_ping')
          console.log(id, topic)
        },
      )

      // Subscribe to session event
      _client.on(
        'session_event',
        ({ event, chainId }: { event: any; chainId: string }) => {
          console.log('EVENT', 'session_event')
          console.log(event, chainId)
        },
      )

      // Subscribe to session update
      _client.on(
        'session_update',
        ({
          topic,
          session,
        }: {
          topic: string
          session: SessionTypes.Struct
        }) => {
          console.log('EVENT', 'session_updated')
          setSession(session)
        },
      )

      // Subscribe to session delete
      _client.on(
        'session_delete',
        ({ id, topic }: { id: number; topic: string }) => {
          console.log('EVENT', 'session_deleted')
          console.log(id, topic)
          resetApp()
        },
      )
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

  const createWeb3Provider = useCallback(
    (ethereumProvider: UniversalProvider) => {
      const web3Provider = new providers.Web3Provider(ethereumProvider)
      setWeb3Provider(web3Provider)
    },
    [],
  )

  const connect = useCallback(
    async (caipChainId: string, pairing?: { topic: string }) => {
      if (!ethereumProvider) {
        throw new ReferenceError('WalletConnect Client is not initialized.')
      }

      const chainId = caipChainId.split(':').pop()

      console.log('Enabling EthereumProvider for chainId: ', chainId)

      const session = await ethereumProvider.connect({
        namespaces: {
          eip155: {
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_sign',
              'personal_sign',
              'eth_signTypedData',
              'wallet_addEthereumChain'
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

      createWeb3Provider(ethereumProvider)
      const _accounts = await ethereumProvider.enable()
      setAccounts(_accounts)
      setSession(session)
      setChain(caipChainId)

      web3Modal?.closeModal()
    },
    [ethereumProvider, createWeb3Provider, web3Modal],
  )

  const onSessionConnected = useCallback(
    async (_session: SessionTypes.Struct) => {
      if (!ethereumProvider) {
        throw new ReferenceError('EthereumProvider is not initialized.')
      }
      const allNamespaceAccounts = Object.values(_session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()
      const allNamespaceChains = Object.keys(_session.namespaces)

      const chainData = allNamespaceAccounts[0].split(':')
      const caipChainId = `${chainData[0]}:${chainData[1]}`
      console.log('restored caipChainId', caipChainId)
      setChain(caipChainId)
      setSession(_session)
      setAccounts(allNamespaceAccounts.map((account) => account.split(':')[2]))
      console.log('RESTORED', allNamespaceChains, allNamespaceAccounts)
      createWeb3Provider(ethereumProvider)

      const account = await web3Connect(chainNameToEnum(chainData[1]), ethereumProvider)
      dispatch({ type: ActionTypes.connect, payload: { account } })

      await Promise.all([getBalance(account)])
    },
    [ethereumProvider, createWeb3Provider],
  )

  const _checkForPersistedSession = useCallback(
    async (provider: UniversalProvider) => {
      if (typeof provider === 'undefined') {
        throw new Error('WalletConnect is not initialized')
      }
      const pairings = provider.client.pairing.getAll({ active: true })
      // populates existing pairings to state
      setPairings(pairings)
      console.log('RESTORED PAIRINGS: ', pairings)
      if (typeof session !== 'undefined') return
      // populates (the last) existing session to state
      if (ethereumProvider?.session) {
        const _session = ethereumProvider?.session
        console.log('RESTORED SESSION:', _session)
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
  }, [client, createClient])

  useEffect(() => {
    if (ethereumProvider && web3Modal)
      _subscribeToProviderEvents(ethereumProvider)
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
    chain,
    connect,
    ethereumProvider
  }
}
