import { useRouter } from 'next/router'
import { useCallback, useState, useMemo, useEffect } from 'react'
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
import { BlockchainId, ProviderId, blockchains } from '@/domain/connect/base'
import { usePaymentMethod } from '../../../hooks/common/usePaymentMethod'
import { useAccountRewards as useNodeRewards } from '../../../hooks/common/node/useRewards'

export type UseHeaderReturn = UseRoutesReturn & {
  accountAddress?: string
  accountBalance?: number
  accountVouchers?: AccountPickerProps['accountVouchers'] | undefined
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
  const { voucherManager } = state.manager

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
        id: ProviderId.WalletConnect,
        name: 'Wallet Connect',
        icon: 'walletConnect',
        color: 'main0',
      },
      {
        id: ProviderId.Phantom,
        name: 'Phantom',
        icon: 'phantom',
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
  const [accountVouchers, setAccountVouchers] = useState<
    AccountPickerProps['accountVouchers']
  >([])

  useEffect(() => {
    const fetchAndFormatVouchers = async () => {
      if (!account || !voucherManager) return

      const vouchers = await voucherManager.getAll()
      const groupedVouchers = vouchers.reduce(
        (grouped, voucher) => {
          const { metadataId } = voucher
          if (!grouped[metadataId]) grouped[metadataId] = []
          grouped[metadataId].push(voucher)
          return grouped
        },
        {} as Record<string, typeof vouchers>,
      )

      const formattedVouchers = Object.values(groupedVouchers).flatMap(
        (vouchers) => {
          if (!vouchers.length) return []

          const { name, icon } = vouchers[0]
          return {
            name: name,
            image: icon,
            imageAlt: name,
            amount: vouchers.length,
          }
        },
      )

      setAccountVouchers(formattedVouchers)
    }

    fetchAndFormatVouchers()
  }, [account, voucherManager])

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

  // Add node rewards functionality from src_account
  const {
    calculatedRewards: userRewards,
    distributionTimestamp: lastDistribution,
  } = account?.address
    ? useNodeRewards({ address: account?.address })
    : { calculatedRewards: undefined, distributionTimestamp: undefined }

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
    accountVouchers,
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
