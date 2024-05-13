import { useRouter } from 'next/router'
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { Blockchain } from '@aleph-sdk/core'
import { Account } from '@aleph-sdk/account'
import { useAppState } from '@/contexts/appState'
import { useConnect } from '../common/useConnect'
import { useSessionStorage } from 'usehooks-ts'
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

export function chainNameToEnum(chainName?: string): Blockchain {
  switch (chainName) {
    case 'Ethereum':
      return Blockchain.ETH
    case 'Avalanche':
      return Blockchain.AVAX
    case 'Solana':
      return Blockchain.SOL
    default:
      return Blockchain.ETH
  }
}

export function chainEnumToName(chain: Blockchain): string {
  switch (chain) {
    case Blockchain.ETH:
      return 'Ethereum'
    case Blockchain.AVAX:
      return 'Avalanche'
    case Blockchain.SOL:
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
}

export function useHeader(): UseHeaderReturn {
  const {
    connect,
    disconnect,
    isConnected,
    selectedNetwork: selectedNetworkChain,
    switchNetwork: switchNetworkChain,
  } = useConnect()
  const { routes } = useRoutes()
  const router = useRouter()

  const { pathname } = router

  // --------------------

  const provider = useCallback(() => {
    ;(window.ethereum as any)?.on('accountsChanged', function () {
      connect()
    })

    return window.ethereum
  }, [connect])

  const [keepAccountAlive, setkeepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )

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
      if (!isConnected && (wallet || network)) {
        setkeepAccountAlive(true)
        const prov = provider()
        const acc = await connect(chainNameToEnum(network?.name), prov)
        if (!acc) return
        // router.push('/')
      } else {
        setkeepAccountAlive(false)
        await disconnect()
        router.push('/')
      }
    },
    [connect, disconnect, provider, isConnected, router, setkeepAccountAlive],
  )

  // @todo: handle this on the provider method of the WalletConnect component
  // the provider function should initialize the provider and return a dispose function
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
          },
        ],
      },
    ],
    [],
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
  }
}
