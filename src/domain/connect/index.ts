/**
 * Connection domain exports
 * Provides blockchain and provider type definitions
 */

import { Blockchain as BlockchainId } from '@aleph-sdk/core'

export { BlockchainId }

// Provider types
export enum ProviderId {
  Reown = 'reown',
}

export type Provider = {
  id: ProviderId
  name: string
}

export const providers: Record<ProviderId, Provider> = {
  [ProviderId.Reown]: {
    id: ProviderId.Reown,
    name: 'Reown',
  },
}

// Blockchain definitions
export type Blockchain = {
  id: BlockchainId
  name: string
  chainId: number
  eip155: boolean
  solana: boolean
  currency: string
  explorerUrl?: string
  rpcUrl?: string
}

export const blockchains: Record<BlockchainId, Blockchain> = {
  [BlockchainId.ETH]: {
    id: BlockchainId.ETH,
    name: 'Ethereum',
    chainId: 1,
    eip155: true,
    solana: false,
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io/',
    rpcUrl: 'https://eth.drpc.org',
  },
  [BlockchainId.AVAX]: {
    id: BlockchainId.AVAX,
    name: 'Avalanche',
    chainId: 43114,
    eip155: true,
    solana: false,
    currency: 'AVAX',
    explorerUrl: 'https://subnets.avax.network/c-chain/',
    rpcUrl: 'https://avalanche.drpc.org',
  },
  [BlockchainId.BASE]: {
    id: BlockchainId.BASE,
    name: 'Base',
    chainId: 8453,
    eip155: true,
    solana: false,
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org',
  },
  [BlockchainId.SOL]: {
    id: BlockchainId.SOL,
    name: 'Solana',
    chainId: 900,
    eip155: false,
    solana: true,
    currency: 'SOL',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com/',
  },
} as Record<BlockchainId, Blockchain>

export const networks: Record<number, Blockchain> = {
  1: blockchains.ETH,
  43114: blockchains.AVAX,
  8453: blockchains.BASE,
  900: blockchains.SOL,
}
