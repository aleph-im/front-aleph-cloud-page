import { useRouter } from 'next/router'
import { useCallback, useState, useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
import {
  AccountPickerProps,
  BreakpointId,
  Network,
  Wallet,
} from '@aleph-front/core'
import {
  UseBreadcrumbNamesReturn,
  useBreadcrumbNames,
} from '../common/useBreadcrumbNames'
import { UseRoutesReturn, useRoutes } from '../common/useRoutes'
import { useConnection } from '../common/useConnection'
import { BlockchainId, ProviderId, blockchains } from '@/domain/connect/base'

export type UseHeaderReturn = UseRoutesReturn & {
  accountAddress?: string
  accountBalance?: number
  networks: Network[]
  pathname: string
  breadcrumbNames: UseBreadcrumbNamesReturn['names']
  breakpoint: BreakpointId
  isOpen: boolean
  rewards?: AccountPickerProps['rewards']
  selectedNetwork: AccountPickerProps['selectedNetwork']
  handleSwitchNetwork: AccountPickerProps['handleSwitchNetwork']
  handleToggle: (isOpen: boolean) => void
  handleConnect: AccountPickerProps['handleConnect']
  handleDisconnect: AccountPickerProps['handleDisconnect']
}

export function useHeader(): UseHeaderReturn {
  const [state] = useAppState()
  const {
    provider,
    blockchain,
    account,
    balance: accountBalance,
  } = state.connection

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
    return networks.find((network) => (network as Network).id === id)
  }, [networks, blockchain])

  // -----------------------

  return {
    accountAddress: account?.address,
    accountBalance,
    networks,
    pathname,
    routes,
    breadcrumbNames,
    breakpoint,
    isOpen,
    selectedNetwork: selectedNetwork || networks[0],
    handleSwitchNetwork,
    handleToggle,
    handleConnect,
    handleDisconnect,
  }
}
