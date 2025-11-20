/**
 * Provider type definitions for multi-chain support
 * Handles both EVM (Ethereum, Avalanche, Base) and Solana providers
 */

/**
 * EVM Provider (EIP-1193 compatible)
 * Used for Ethereum, Avalanche, and Base networks
 */
export type Eip155Provider = {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on?: (event: string, handler: (...args: any[]) => void) => void
  removeListener?: (event: string, handler: (...args: any[]) => void) => void
}

/**
 * Solana Provider
 * Uses native Solana methods instead of EIP-1193 request pattern
 */
export type SolanaProvider = {
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>
  signTransaction: (transaction: any) => Promise<any>
  signAllTransactions: (transactions: any[]) => Promise<any[]>
  publicKey?: any
  on?: (event: string, handler: (...args: any[]) => void) => void
  removeListener?: (event: string, handler: (...args: any[]) => void) => void
}

/**
 * Union type for all supported provider types
 */
export type MultiChainProvider = Eip155Provider | SolanaProvider

/**
 * Type guard to check if a provider is an EVM provider
 */
export function isEip155Provider(
  provider: unknown,
): provider is Eip155Provider {
  return (
    typeof provider === 'object' &&
    provider !== null &&
    'request' in provider &&
    typeof (provider as any).request === 'function'
  )
}

/**
 * Type guard to check if a provider is a Solana provider
 */
export function isSolanaProvider(
  provider: unknown,
): provider is SolanaProvider {
  return (
    typeof provider === 'object' &&
    provider !== null &&
    'signMessage' in provider &&
    typeof (provider as any).signMessage === 'function'
  )
}

/**
 * Chain type identifier
 */
export type ChainType = 'evm' | 'solana'
