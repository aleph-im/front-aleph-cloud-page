import { createContext, useContext, useCallback } from 'react'
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
  useDisconnect,
} from '@reown/appkit/react'
import { mainnet, avalanche, base, solana } from '@reown/appkit/networks'
import { Account } from '@aleph-sdk/account'
import { Blockchain as BlockchainId } from '@aleph-sdk/core'
import { getAccountFromProvider as getETHAccount } from '@aleph-sdk/ethereum'
import { getAccountFromProvider as getSOLAccount } from '@aleph-sdk/solana'
import { getAccountFromProvider as getAVAXAccount } from '@aleph-sdk/avalanche'
import { getAccountFromProvider as getBASEAccount } from '@aleph-sdk/base'
import { ProviderId } from '@/domain/connect'
import { isEip155Provider, isSolanaProvider } from '@/domain/connect/types'

/**
 * Reown context return type
 */
export type ReownContextValue = {
  // Connection state
  isConnected: boolean
  address?: string
  chainId?: number | string

  // Actions
  openModal: (blockchain?: BlockchainId) => void
  closeModal: () => void
  switchNetwork: (chainId: number) => Promise<void>
  disconnect: () => Promise<void>

  // Aleph SDK integration
  getAlephAccount: () => Promise<Account | undefined>
  getBlockchainId: () => BlockchainId | undefined
  getProviderId: () => ProviderId | undefined

  // Raw provider access (for advanced use cases)
  walletProvider?: any
}

/**
 * Context for Reown connection state and methods
 */
const ReownContext = createContext<ReownContextValue | undefined>(undefined)

/**
 * Provider component that wraps Reown hooks and provides unified interface
 */
export const ReownProvider = ({ children }: { children: React.ReactNode }) => {
  const appKit = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const { chainId, switchNetwork: reownSwitchNetwork } = useAppKitNetwork()
  const { walletProvider: eip155Provider } = useAppKitProvider('eip155')
  const { walletProvider: solanaProvider } = useAppKitProvider('solana')

  /**
   * Maps Reown chain ID to Aleph blockchain ID
   */
  const getBlockchainId = useCallback((): BlockchainId | undefined => {
    if (!chainId) return undefined

    // Handle Solana string-based chain ID
    if (typeof chainId === 'string') {
      // Check if it's a Solana chain ID
      // Solana chain ID is '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' (without 'solana:' prefix)
      // or can include 'solana:' prefix
      if (
        chainId.toLowerCase().includes('solana') ||
        chainId === '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
      ) {
        return BlockchainId.SOL
      }
      // Try parsing as number for EVM chains
      const parsed = parseInt(chainId)
      if (!isNaN(parsed)) {
        return getBlockchainIdFromNumber(parsed)
      }
      return undefined
    }

    return getBlockchainIdFromNumber(chainId)
  }, [chainId])

  const getBlockchainIdFromNumber = (
    numericChainId: number,
  ): BlockchainId | undefined => {
    switch (numericChainId) {
      case 1:
        return BlockchainId.ETH
      case 43114:
        return BlockchainId.AVAX
      case 8453:
        return BlockchainId.BASE
      case 900:
        return BlockchainId.SOL
      default:
        return undefined
    }
  }

  /**
   * Returns provider ID (always Reown in this implementation)
   */
  const getProviderId = useCallback((): ProviderId | undefined => {
    return isConnected ? ProviderId.Reown : undefined
  }, [isConnected])

  /**
   * Creates Aleph SDK account from current wallet provider
   */
  const getAlephAccount = useCallback(async (): Promise<
    Account | undefined
  > => {
    if (!isConnected) return undefined

    const blockchainId = getBlockchainId()
    if (!blockchainId) return undefined

    // Select the correct provider based on blockchain
    const provider =
      blockchainId === BlockchainId.SOL ? solanaProvider : eip155Provider

    if (!provider) {
      console.error('No provider available for blockchain:', blockchainId)
      return undefined
    }

    try {
      let account: Account

      switch (blockchainId) {
        case BlockchainId.ETH:
          if (!isEip155Provider(provider))
            throw new Error('Invalid provider for ETH')
          account = await getETHAccount(provider as any)
          break

        case BlockchainId.AVAX:
          if (!isEip155Provider(provider))
            throw new Error('Invalid provider for AVAX')
          account = await getAVAXAccount(provider as any)
          break

        case BlockchainId.BASE:
          if (!isEip155Provider(provider))
            throw new Error('Invalid provider for BASE')
          account = await getBASEAccount(provider as any)
          break

        case BlockchainId.SOL:
          if (!isSolanaProvider(provider))
            throw new Error('Invalid provider for SOL')
          account = await getSOLAccount(provider as any)
          break

        default:
          throw new Error(`Unsupported blockchain: ${blockchainId}`)
      }

      return account
    } catch (error) {
      console.error('Failed to create Aleph account:', error)
      return undefined
    }
  }, [eip155Provider, solanaProvider, isConnected, getBlockchainId])

  /**
   * Switches to a different blockchain network
   * Maps chain ID to Reown network object
   */
  const handleSwitchNetwork = useCallback(
    async (chainId: number) => {
      let network

      switch (chainId) {
        case 1:
          network = mainnet
          break
        case 43114:
          network = avalanche
          break
        case 8453:
          network = base
          break
        case 900:
          network = solana
          break
        default:
          throw new Error(`Unsupported chain ID: ${chainId}`)
      }

      await reownSwitchNetwork(network)
    },
    [reownSwitchNetwork],
  )

  /**
   * Disconnects the current wallet properly
   */
  const handleDisconnect = useCallback(async () => {
    try {
      // Disconnect from all namespaces
      await disconnect()

      // Close modal
      await appKit.close()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }, [disconnect, appKit])

  /**
   * Opens the Reown modal with Connect view and appropriate namespace
   */
  const handleOpenModal = useCallback(
    (blockchain?: BlockchainId) => {
      // Determine blockchain to use (provided or current)
      const targetBlockchain = blockchain || getBlockchainId()

      // Determine namespace based on blockchain
      let namespace: 'eip155' | 'solana' = 'eip155'
      if (targetBlockchain === BlockchainId.SOL) {
        namespace = 'solana'
      }

      // Open modal with Connect view and appropriate namespace
      appKit.open({ view: 'Connect', namespace })
    },
    [appKit, getBlockchainId],
  )

  const value: ReownContextValue = {
    isConnected,
    address,
    chainId,
    openModal: handleOpenModal,
    closeModal: appKit.close,
    switchNetwork: handleSwitchNetwork,
    disconnect: handleDisconnect,
    getAlephAccount,
    getBlockchainId,
    getProviderId,
    walletProvider:
      getBlockchainId() === BlockchainId.SOL ? solanaProvider : eip155Provider,
  }

  return <ReownContext.Provider value={value}>{children}</ReownContext.Provider>
}

/**
 * Hook to access Reown connection context
 */
export const useReown = (): ReownContextValue => {
  const context = useContext(ReownContext)
  if (!context) {
    throw new Error('useReown must be used within ReownProvider')
  }
  return context
}
