/**
 * Privy Configuration
 *
 * Initializes Privy for email/social login with ERC-4337 smart wallets.
 * Provides a second provider (ProviderId.Privy) alongside Reown for EVM chains.
 *
 * Supported Networks (EVM only — Solana stays on Reown):
 * - Ethereum mainnet (Chain ID: 1)
 * - Avalanche C-Chain (Chain ID: 43114)
 * - Base (Chain ID: 8453)
 *
 * Paymaster/bundler is configured via the Privy Dashboard, not in code:
 * https://dashboard.privy.io → App settings → Smart wallets → Gas policy.
 * This keeps the paymaster vendor (Pimlico / Alchemy / Biconomy) swappable
 * without a code deploy.
 *
 * Required env vars (see `.env.local`):
 * - NEXT_PUBLIC_PRIVY_APP_ID — from https://dashboard.privy.io → Apps → <app> → Settings
 *
 * Smart wallets must be enabled in the Privy Dashboard before they return a
 * non-null client at runtime.
 *
 * @see https://docs.privy.io
 */

import { mainnet, avalanche, base } from 'viem/chains'
import type { Chain } from 'viem'
import type { PrivyClientConfig } from '@privy-io/react-auth'
import { blockchains } from '@/domain/connect'
import { Blockchain as BlockchainId } from '@aleph-sdk/core'

export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string

/**
 * Overrides viem's default public RPC (e.g. https://eth.merkle.io) with the
 * RPCs configured per-chain in `src/domain/connect/index.ts`. viem's bundled
 * chain objects point to heavily rate-limited public endpoints (we observed
 * 429s on merkle) — this keeps Privy + smart-wallet traffic on the same RPCs
 * the rest of the app already trusts.
 */
function withAlephRpc(chain: Chain, blockchainId: BlockchainId): Chain {
  const rpcUrl = blockchains[blockchainId]?.rpcUrl
  if (!rpcUrl) return chain
  return {
    ...chain,
    rpcUrls: {
      default: { http: [rpcUrl] },
      public: { http: [rpcUrl] },
    },
  }
}

const ethereumMainnet = withAlephRpc(mainnet, BlockchainId.ETH)
const avalancheChain = withAlephRpc(avalanche, BlockchainId.AVAX)
const baseChain = withAlephRpc(base, BlockchainId.BASE)

/**
 * EVM chains exposed to Privy. Order matters — the first chain is the default
 * the embedded wallet connects to on first login.
 */
export const privySupportedChains = [
  ethereumMainnet,
  avalancheChain,
  baseChain,
] as const

/**
 * Default chain for new Privy sessions. Must be one of `privySupportedChains`.
 */
export const privyDefaultChain = ethereumMainnet

/**
 * Shared Privy client config. Keep appearance knobs in sync with the Aleph
 * Cloud design system. Login methods are intentionally Privy-first with an
 * explicit `wallet` fallback so crypto-native users can still connect an EOA
 * through Privy if they prefer (Reown remains available via "Use another
 * wallet" in the Connect modal).
 */
export const privyConfig: PrivyClientConfig = {
  loginMethods: ['email', 'google', 'apple', 'wallet'],
  appearance: {
    theme: 'dark',
    accentColor: '#00D1FF',
    logo: '/img/aleph-logo.svg',
    showWalletLoginFirst: false,
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: false,
  },
  defaultChain: privyDefaultChain,
  supportedChains: [...privySupportedChains],
}

export type OnrampRecipient = 'EOA' | 'SA' | 'CONTRACT'

export const PRIVY_ONRAMP_RECIPIENT: OnrampRecipient =
  (process.env.NEXT_PUBLIC_PRIVY_ONRAMP_RECIPIENT as OnrampRecipient) ??
  'CONTRACT'

export const PRIVY_ONRAMP_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_PRIVY_ONRAMP_CONTRACT_ADDRESS ??
  '0x6b55F32Ea969910838defd03746Ced5E2AE8cB8B'

export function resolveOnrampRecipient(eoa: string, sa: string): string {
  switch (PRIVY_ONRAMP_RECIPIENT) {
    case 'EOA':
      return eoa
    case 'SA':
      return sa
    default:
      return PRIVY_ONRAMP_CONTRACT_ADDRESS
  }
}
