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
} from '../../../hooks/common/useBreadcrumbNames'
import { UseRoutesReturn, useRoutes } from '../../../hooks/common/useRoutes'
import { useConnection } from '../../../hooks/common/useConnection'
import { usePrivyConnection } from '../../../hooks/common/usePrivyConnection'
import { BlockchainId, ProviderId, blockchains } from '@/domain/connect'
import { PRIVY_APP_ID } from '@/config/privy'
import { usePaymentMethod } from '../../../hooks/common/usePaymentMethod'
import { useAccountRewards as useNodeRewards } from '../../../hooks/common/node/useRewards'
import { selectDisplayAddress } from '@/store/connection'

export type UseHeaderReturn = Pick<UseRoutesReturn, 'routes'> & {
  accountAddress?: string // SA for Privy users, EOA otherwise
  eoaAddress?: string // raw EOA — only shown in Settings panel
  accountBalance?: number
  accountCreditBalance?: number
  blockchain?: BlockchainId
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
    blockchain,
    account,
    balance: accountBalance,
    creditBalance: accountCreditBalance,
  } = state.connection

  const displayAddress = selectDisplayAddress(state.connection)

  const { handleConnect: connect, handleDisconnect: disconnect } =
    useConnection({ triggerOnMount: true })

  const { handleConnect: connectPrivy } = usePrivyConnection()

  usePaymentMethod({ triggerOnMount: true })

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

  const reownWallet: Wallet = useMemo(
    () => ({
      id: ProviderId.Reown,
      name: 'Wallet Connect',
      icon: 'walletConnect',
      color: 'main0',
    }),
    [],
  )

  const privyWallet: Wallet = useMemo(
    () => ({
      id: ProviderId.Privy,
      name: 'Sign in with email',
      icon: 'envelope',
      color: 'main0',
    }),
    [],
  )

  // Privy is EVM-only; on EVM networks we list it first so the Privy-first
  // goal holds, with Wallet Connect as the fallback. Solana stays on Reown
  // because Privy's smart wallets preset is EVM-only today.
  const evmWallets: Wallet[] = useMemo(
    () => (PRIVY_APP_ID ? [privyWallet, reownWallet] : [reownWallet]),
    [privyWallet, reownWallet],
  )

  const solWallets: Wallet[] = useMemo(() => [reownWallet], [reownWallet])

  const networks: Network[] = useMemo(
    () => [
      {
        id: BlockchainId.ETH,
        icon: 'ethereum',
        name: 'Ethereum',
        wallets: evmWallets,
      },
      {
        id: BlockchainId.AVAX,
        icon: 'avalanche',
        name: 'Avalanche',
        wallets: evmWallets,
      },
      {
        id: BlockchainId.BASE,
        icon: 'base',
        name: 'Base',
        wallets: evmWallets,
      },
      {
        id: BlockchainId.SOL,
        icon: 'solana',
        name: 'Solana',
        wallets: solWallets,
      },
    ],
    [evmWallets, solWallets],
  )

  // --------------------

  const handleConnect = useCallback(
    async (wallet: Wallet, network: Network) => {
      const blockchain = (network as any).id as BlockchainId

      if (wallet.id === ProviderId.Privy) {
        await connectPrivy()
        return
      }

      connect({ blockchain })
    },
    [connect, connectPrivy],
  )

  const handleSwitchNetwork = useCallback(
    (network: Network) => {
      const blockchain = (network as any).id as BlockchainId
      connect({ blockchain })
    },
    [connect],
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

  // Add node rewards functionality from src_account
  // Always call hooks unconditionally to follow React rules
  const {
    calculatedRewards: userRewards,
    distributionTimestamp: lastDistribution,
  } = useNodeRewards({ address: account?.address || '' })

  const pendingDays = useMemo(() => {
    const distributionInterval = 10 * 24 * 60 * 60 * 1000 // 10 days

    if (lastDistribution === undefined) {
      const pendingDays = Math.ceil(
        distributionInterval / (1000 * 60 * 60 * 24),
      )
      return pendingDays
    }

    const elapsedFromLast = Date.now() - lastDistribution
    const timeTillNext = distributionInterval - elapsedFromLast

    const pendingTime = Math.max(Math.ceil(timeTillNext), 0)
    const pendingDays = Math.ceil(pendingTime / (1000 * 60 * 60 * 24))

    return pendingDays
  }, [lastDistribution])

  const rewards = useMemo(() => {
    if (!userRewards) return

    return {
      amount: userRewards,
      days: pendingDays,
    }
  }, [pendingDays, userRewards])

  return {
    accountAddress: displayAddress,
    eoaAddress: account?.address,
    accountBalance,
    accountCreditBalance,
    blockchain,
    networks,
    pathname,
    routes,
    breadcrumbNames,
    breakpoint,
    isOpen,
    rewards,
    selectedNetwork: selectedNetwork || networks[0],
    handleSwitchNetwork,
    handleToggle,
    handleConnect,
    handleDisconnect,
  }
}
