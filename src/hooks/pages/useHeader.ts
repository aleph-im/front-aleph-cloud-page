import { useRouter } from 'next/router'
import { useCallback, useState, useRef, RefObject, useMemo } from 'react'
import { Account } from '@aleph-sdk/account'
import { useAppState } from '@/contexts/appState'
import {
  BreakpointId,
  Network,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
  WalletPickerProps,
  Wallet,
} from '@aleph-front/core'
import {
  UseBreadcrumbNamesReturn,
  useBreadcrumbNames,
} from '../common/useBreadcrumbNames'
import { UseRoutesReturn, useRoutes } from '../common/useRoutes'
import { useConnection } from '../common/useConnection'
import { BlockchainId, ProviderId, blockchains } from '@/domain/connect/base'

export type UseAccountButtonProps = Pick<
  UseHeaderReturn,
  | 'rewards'
  | 'rewards'
  | 'networks'
  | 'selectedNetwork'
  | 'handleSwitchNetwork'
  | 'handleConnect'
  | 'handleDisconnect'
>

export type UseAccountButtonReturn = UseAccountButtonProps &
  Pick<
    UseHeaderReturn,
    'handleSwitchNetwork' | 'handleConnect' | 'handleDisconnect'
  > & {
    account: Account | undefined
    accountBalance?: number
    displayWalletPicker: boolean
    walletPickerOpen: boolean
    walletPickerRef: RefObject<HTMLDivElement>
    walletPickerTriggerRef: RefObject<HTMLButtonElement>
    walletPosition: { x: number; y: number }
    handleDisplayWalletPicker: () => void
  }

export function useAccountButton({
  handleConnect: handleConnectProp,
  handleDisconnect: handleDisconnectProp,
  ...rest
}: UseAccountButtonProps): UseAccountButtonReturn {
  const [state] = useAppState()
  const { account, balance: accountBalance } = state.connection

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
    (wallet: Wallet, network: Network) => {
      handleConnectProp(wallet, network)
      setDisplayWalletPicker(false)
    },
    [handleConnectProp],
  )

  const handleDisconnect = useCallback(() => {
    handleDisconnectProp()
    setDisplayWalletPicker(false)
  }, [handleDisconnectProp])

  return {
    account,
    accountBalance,
    walletPickerOpen,
    displayWalletPicker: shouldMount,
    walletPickerRef: myRef,
    walletPickerTriggerRef: atRef,
    walletPosition: position,
    handleDisplayWalletPicker,
    handleConnect,
    handleDisconnect,
    ...rest,
  }
}

// -----------------------------

export type UseHeaderReturn = UseRoutesReturn & {
  networks: Network[]
  pathname: string
  breadcrumbNames: UseBreadcrumbNamesReturn['names']
  breakpoint: BreakpointId
  isOpen: boolean
  rewards?: WalletPickerProps['rewards']
  selectedNetwork: WalletPickerProps['selectedNetwork']
  handleSwitchNetwork: WalletPickerProps['onSwitchNetwork']
  handleToggle: (isOpen: boolean) => void
  handleConnect: (wallet: Wallet, network: Network) => void
  handleDisconnect: () => void
}

export function useHeader(): UseHeaderReturn {
  const [state] = useAppState()
  const { provider, blockchain } = state.connection

  const { handleConnect: connect, handleDisconnect: disconnect } =
    useConnection({ triggerOnMount: true })

  const { routes } = useRoutes()
  const router = useRouter()
  const { pathname } = router

  // --------------------

  const { names: breadcrumbNames } = useBreadcrumbNames()

  // --------------------

  const breakpoint = 'lg'

  // --------------------

  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = useCallback((open: boolean) => setIsOpen(open), [])

  // --------------------

  const wallets: Wallet[] = useMemo(
    () => [
      {
        id: ProviderId.Metamask,
        name: 'Metamask',
        icon: 'metamask',
        color: 'orange',
      },
      {
        id: ProviderId.WalletConnect,
        name: 'Wallet Connect',
        icon: 'walletConnect',
        color: 'main0',
      },
    ],
    [],
  )

  const networks: Network[] = useMemo(
    () => [
      {
        id: BlockchainId.ETH,
        icon: 'ethereum',
        name: 'Ethereum',
        wallets,
      },
      {
        id: BlockchainId.AVAX,
        icon: 'avalanche',
        name: 'Avalanche',
        wallets,
      },
    ],
    [wallets],
  )

  // --------------------

  const handleConnect = useCallback(
    async (wallet: Wallet, network: Network) => {
      const provider = (wallet as any).id as ProviderId
      const blockchain = (network as any).id as BlockchainId
      connect({ provider, blockchain })
    },
    [connect],
  )

  const handleSwitchNetwork = useCallback(
    (network: Network) => {
      const blockchain = (network as any).id as BlockchainId
      connect({ provider, blockchain })
    },
    [connect, provider],
  )

  const handleDisconnect = useCallback(async () => {
    disconnect()
  }, [disconnect])

  const selectedNetwork = useMemo(() => {
    if (!blockchain) return

    const id = blockchains[blockchain].id
    return networks.find((network) => (network as any).id === id)
  }, [networks, blockchain])

  // -----------------------

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
