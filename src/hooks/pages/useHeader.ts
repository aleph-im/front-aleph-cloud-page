import { useRouter } from 'next/router'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { useAppState } from '@/contexts/appState'
import { chainToId, useConnect } from '../common/useConnect'
import { useSessionStorage } from 'usehooks-ts'
import {
  BreakpointId,
  useClickOutside,
  useFloatPosition,
  useTransitionedEnterExit,
  useWindowScroll,
  useWindowSize,
  WalletProps,
  NetworkProps,
} from '@aleph-front/core'
import { useRoutes, UseRoutesReturn } from '../common/useRoutes'
import {
  useBreadcrumbNames,
  UseBreadcrumbNamesReturn,
} from '../common/useBreadcrumbNames'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import Provider, { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ethers } from 'ethers'

export type UseAccountButtonProps = {
  handleConnect: (wallet?: WalletProps, network?: NetworkProps) => Promise<void>
  handleDisconnect: () => void
  provider: () => void
  walletConnectProvider: () => Promise<Provider>
}

export type UseAccountButtonReturn = UseAccountButtonProps & {
  theme: DefaultTheme
  account: Account | undefined
  accountBalance?: number
  displayWalletPicker: boolean
  walletPickerOpen: boolean
  walletPickerRef: RefObject<HTMLDivElement>
  walletPickerTriggerRef: RefObject<HTMLButtonElement>
  walletPosition: { x: number; y: number }
  handleDisplayWalletPicker: () => void
}

export type Providers = ethers.providers.ExternalProvider | Provider

export function chainNameToEnum(chainName?: string): Chain {
  switch (chainName) {
    case 'Ethereum':
      return Chain.ETH
    case 'Avalanche':
      return Chain.AVAX
    case 'Solana':
      return Chain.SOL
    default:
      return Chain.ETH
  }
}

export function chainEnumToName(chain: Chain): string {
  switch (chain) {
    case Chain.ETH:
      return 'Ethereum'
    case Chain.AVAX:
      return 'Avalanche'
    case Chain.SOL:
      return 'Solana'
    default:
      return 'Ethereum'
  }
}

async function resolveProvider(provider: (() => any) | undefined): Promise<Providers> {
  if (provider) {
    if (typeof (provider as any).then === 'function') {
      return await provider()
    }
    return provider()
  }
  return window.ethereum
}

function idToChain(id: number): Chain | null {
  switch (id) {
    case 1:
      return Chain.ETH
    case 43114:
      return Chain.AVAX
    default:
      return null
  }
}

export function useAccountButton({
  handleConnect: handleConnectProp,
  ...rest
}: UseAccountButtonProps): UseAccountButtonReturn {
  const { account } = useConnect()
  const theme = useTheme()
  const [appState] = useAppState()

  // const { balance: accountBalance } = appState.account
  const { accountBalance } = appState

  const [displayWalletPicker, setDisplayWalletPicker] = useState(false)

  // --------------------

  const walletPickerRef = useRef<HTMLDivElement>(null)
  const walletPickerTriggerRef = useRef<HTMLButtonElement>(null)

  useClickOutside(() => {
    if (displayWalletPicker) setDisplayWalletPicker(false)
  }, [walletPickerRef, walletPickerTriggerRef])

  const handleDisplayWalletPicker = () => {
    setDisplayWalletPicker(!displayWalletPicker)
  }

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount, state } = useTransitionedEnterExit({
    onOff: displayWalletPicker,
    ref: walletPickerRef,
  })

  const { myRef, atRef, position } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: walletPickerRef,
    atRef: walletPickerTriggerRef,
    deps: [account, windowSize, windowScroll, shouldMount],
  })

  const walletPickerOpen = state === 'enter'

  const handleConnect = useCallback(
    async (wallet?: WalletProps, network?: NetworkProps) => {
      await handleConnectProp(wallet, network)
      setDisplayWalletPicker(false)
    },
    [handleConnectProp],
  )

  return {
    theme,
    account,
    accountBalance,
    walletPickerOpen,
    displayWalletPicker: shouldMount,
    walletPickerRef: myRef,
    walletPickerTriggerRef: atRef,
    walletPosition: position,
    handleDisplayWalletPicker,
    handleConnect,
    ...rest,
  }
}

// -----------------------------

export type UseHeaderReturn = UseRoutesReturn & {
  pathname: string
  breadcrumbNames: UseBreadcrumbNamesReturn['names']
  breakpoint: BreakpointId
  isOpen: boolean
  handleToggle: (isOpen: boolean) => void
  handleConnect: (wallet?: WalletProps, network?: NetworkProps) => Promise<void>
  handleDisconnect: () => void
  provider: () => void
  walletConnectProvider: () => Promise<Provider>
}

export function useHeader(): UseHeaderReturn {
  const { connect, disconnect, isConnected, account, selectedNetwork } =
    useConnect()
  const { routes } = useRoutes()
  const router = useRouter()
  const { pathname } = router

  const [keepAccountAlive, setkeepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )

  const enableConnection = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    } else {
      const provider = await resolveProvider(walletConnectProvider)
      await disconnect(provider)
    }
  }, [connect, disconnect, isConnected, ])

  const walletConnectProvider = async () => {
    const provider = await EthereumProvider.init({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
      showQrModal: true,
      chains: [1],
      optionalChains: [43114],
      /*metadata: {
        name: '',
        description: '',
        url: '',
        icons: ['']
      },
      rpcMap
      qrModalOptions*/
    })

    provider.on('session_event', (event) => {
      // if discrepancy between mobile network and app selected network
      // https://github.com/wevm/viem/discussions/753#discussioncomment-6245812
      console.log(event)
      if (chainToId(selectedNetwork) !== parseInt(event.params.chainId, 16)) {
        //onNoti('Match mobile and app selected network', 'warning')
      }
    })

    provider.on('chainChanged', (chainId) => {
      // manage change network on the mobile, also if wallet is not supported notify it
      console.log(chainId)
      const network = idToChain(Number(chainId))
      if (network) {
        
      } else {
        //onNoti('Use supported networks', 'warning')
      }
    })

    provider.on('disconnect', async () => {
      console.log('disconnected')
      window.localStorage.clear()
    })
    
    provider.signer.on('display_uri', (uri: string) => {
      console.log('display_uri', uri)
    })
    
    provider.signer.on('session_ping', (session: any) => {
      console.log('session_ping', session.id, session.topic)
    })
    
    provider.signer.on('session_event', (session: any) => {
      console.log('session_event', session.event, session.chainId)
    })
    
    provider.signer.on('session_update', (session: any) => {
      console.log('session_update', session.topic, session.params)
    })
    
    provider.signer.on('session_delete', (session: any) => {
      console.log('session_delete', session.id, session.opic)
    })

    return provider
  }

  useEffect(() => {
    const provider = walletConnectProvider()
    return () => {
      provider.then((provider) => provider.disconnect().then())
      //window.localStorage.clear()
    }
  }, [])

  // @note: wait till account is connected and redirect
  const handleConnect = useCallback(
    async (wallet?: WalletProps, network?: NetworkProps) => {
      console.log('handleConnect', wallet, network)
      const provider = await resolveProvider(walletConnectProvider)

      if (!isConnected && (wallet || network)) {
        setkeepAccountAlive(true)
        const acc = await connect(
          chainNameToEnum(network?.name),
          provider,
        )
        if (!acc) return
        // router.push('/')
      } else {
        setkeepAccountAlive(false)
        await disconnect(provider)
        router.push('/')
      }
    },
    [
      connect,
      disconnect,
      isConnected,
      router,
      setkeepAccountAlive,
      walletConnectProvider,
    ],
  )

  useEffect(() => {
    ;(async () => {
      if (!account && keepAccountAlive) {
        enableConnection()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, keepAccountAlive])

  // --------------------

  const provider = () => {
    ;(window.ethereum as any)?.on('accountsChanged', function () {
      connect()
    })

    return window.ethereum
  }

  useEffect(() => {
    provider()
    return () => {
      ;(window.ethereum as any)?.removeListener('accountsChanged', () => {
        connect()
      })
    }
  }, [])

  // --------------------

  const { names: breadcrumbNames } = useBreadcrumbNames()

  // --------------------

  const breakpoint = 'lg'

  // --------------------

  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = useCallback((open: boolean) => setIsOpen(open), [])
  const handleDisconnect = useCallback(() => null, [])

  return {
    pathname,
    routes,
    breadcrumbNames,
    breakpoint,
    isOpen,
    handleToggle,
    handleConnect,
    handleDisconnect,
    provider,
    walletConnectProvider,
  }
}
