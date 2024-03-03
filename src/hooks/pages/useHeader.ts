import { useRouter } from 'next/router'
import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { useAppState } from '@/contexts/appState'
import { useConnect } from '../common/useConnect'
import {
  BreakpointId,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
  WalletProps,
  NetworkProps,
  WalletPickerProps,
} from '@aleph-front/core'
import { useRoutes, UseRoutesReturn } from '../common/useRoutes'
import {
  useBreadcrumbNames,
  UseBreadcrumbNamesReturn,
} from '../common/useBreadcrumbNames'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { WalletConnectContext } from '@/contexts/walletConnect'

export type UseAccountButtonProps = {
  networks: NetworkProps['network'][]
  selectedNetwork: WalletPickerProps['selectedNetwork']
  handleSwitchNetwork: WalletPickerProps['onSwitchNetwork']
  handleConnect: (
    wallet?: WalletProps,
    network?: NetworkProps['network'],
  ) => Promise<void>
  handleDisconnect: () => void
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

  const { shouldMount, stage } = useTransition(displayWalletPicker, 250)

  const { myRef, atRef, position } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: walletPickerRef,
    atRef: walletPickerTriggerRef,
    deps: [account, windowSize, windowScroll, shouldMount],
  })

  const walletPickerOpen = stage === 'enter'

  const handleConnect = useCallback(
    async (wallet?: WalletProps, network?: NetworkProps['network']) => {
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
  networks: NetworkProps['network'][]
  pathname: string
  breadcrumbNames: UseBreadcrumbNamesReturn['names']
  breakpoint: BreakpointId
  isOpen: boolean
  selectedNetwork: WalletPickerProps['selectedNetwork']
  handleSwitchNetwork: WalletPickerProps['onSwitchNetwork']
  handleToggle: (isOpen: boolean) => void
  handleConnect: (
    wallet?: WalletProps,
    network?: NetworkProps['network'],
  ) => Promise<void>
  handleDisconnect: () => void
  provider: () => void
}

export function useHeader(): UseHeaderReturn {
  const {
    connect,
    account,
    disconnect,
    isConnected,
    selectedNetwork: selectedNetworkChain,
    switchNetwork: switchNetworkChain,
    keepAccountAlive
  } = useConnect()
  const walletConnect = useContext(WalletConnectContext)

  const { routes } = useRoutes()
  const router = useRouter()

  const { pathname } = router

  const enableConnection = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    } else {
      await disconnect()
    }
  }, [connect, disconnect, isConnected])

  // @note: wait till account is connected and redirect
  const handleConnect = useCallback(
    async (wallet?: WalletProps, network?: NetworkProps['network']) => {
      console.log('handleConnect', wallet, network)
      if (!isConnected && (wallet || network)) {
        const provider =
          wallet && wallet.provider ? wallet.provider() : window.ethereum
        const acc = await connect(chainNameToEnum(network?.name), provider)
        if (!acc) return
        // router.push('/')
      } else {
        await disconnect()
        router.push('/')
      }
    },
    [connect, disconnect, isConnected, router],
  )

  // --------------------

  const provider = useCallback(() => {
    ;(window.ethereum as any)?.on('accountsChanged', function () {
      connect()
    })

    return window.ethereum
  }, [connect])

  useEffect(() => {
    ;(async () => {
      if (!account && keepAccountAlive) {
        enableConnection()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, keepAccountAlive])

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

  // --------------------

  const networks: NetworkProps['network'][] = useMemo(
    () => [
      {
        icon: 'ethereum',
        name: 'Ethereum',
        wallets: [
          {
            color: 'orange',
            icon: 'metamask',
            name: 'Metamask',
            provider,
          },
          {
            color: 'blue',
            icon: 'walletConnect',
            name: 'Wallet Connect',
            provider: () => walletConnect,
          },
        ],
      },
      {
        icon: 'avalanche',
        name: 'Avalanche',
        wallets: [
          {
            color: 'orange',
            icon: 'metamask',
            name: 'Metamask',
            provider,
          },
          {
            color: 'blue',
            icon: 'walletConnect',
            name: 'Wallet Connect',
            provider: () => walletConnect,
          },
        ],
      },
    ],
    [provider, walletConnect],
  )

  const handleSwitchNetwork = useCallback(
    (network: NetworkProps['network']) => {
      const chain = chainNameToEnum(network.name)
      switchNetworkChain(chain)
    },
    [switchNetworkChain],
  )

  const selectedNetwork = useMemo(() => {
    const name = chainEnumToName(selectedNetworkChain)
    return networks.find((network) => network.name === name)
  }, [networks, selectedNetworkChain])

  return {
    networks,
    pathname,
    routes,
    breadcrumbNames,
    breakpoint,
    isOpen,
    selectedNetwork,
    handleSwitchNetwork,
    handleToggle,
    handleConnect,
    handleDisconnect,
    provider,
  }
}