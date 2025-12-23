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
import { BlockchainId, ProviderId, blockchains } from '@/domain/connect'
import { usePaymentMethod } from '../../../hooks/common/usePaymentMethod'
import { useAccountRewards as useNodeRewards } from '../../../hooks/common/node/useRewards'

export type UseHeaderReturn = Pick<UseRoutesReturn, 'routes'> & {
  accountAddress?: string
  accountBalance?: number
  accountCreditBalance?: number
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

  const { handleConnect: connect, handleDisconnect: disconnect } =
    useConnection({ triggerOnMount: true })

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

  const wallets: Wallet[] = useMemo(
    () => [
      {
        id: ProviderId.Reown,
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
        wallets: wallets,
      },
      {
        id: BlockchainId.AVAX,
        icon: 'avalanche',
        name: 'Avalanche',
        wallets: wallets,
      },
      {
        id: BlockchainId.BASE,
        icon: 'base',
        name: 'Base',
        wallets: wallets,
      },
      {
        id: BlockchainId.SOL,
        icon: 'solana',
        name: 'Solana',
        wallets: wallets,
      },
    ],
    [wallets],
  )

  // --------------------

  const handleConnect = useCallback(
    async (wallet: Wallet, network: Network) => {
      const blockchain = (network as any).id as BlockchainId

      connect({ blockchain })
    },
    [connect],
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
    accountAddress: account?.address,
    accountBalance,
    accountCreditBalance,
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
