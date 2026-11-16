/**
 * Reown AppKit Configuration
 *
 * Initializes Reown AppKit for wallet connections across multiple blockchains.
 * Provides unified interface for MetaMask, WalletConnect, Phantom, and other wallets.
 *
 * Supported Networks:
 * - Ethereum (mainnet) - Chain ID: 1
 * - Avalanche C-Chain - Chain ID: 43114
 * - Base - Chain ID: 8453
 * - Solana - Chain ID: 900
 *
 * Flow: User connects wallet → Reown AppKit → Reown Hooks → Store
 *
 * @see https://docs.reown.com/appkit
 */

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { mainnet, avalanche, base, solana } from '@reown/appkit/networks'

// WalletConnect project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string

// Application metadata shown in wallet connection UI
const metadata = {
  name: 'Aleph Cloud',
  description: 'Aleph Cloud: Web3 cloud solution',
  url: 'https://app.aleph.cloud',
  icons: ['https://app.aleph.cloud/favicon-32x32.png'],
}

// Adapters for different blockchain ecosystems
// Ethers: EVM chains (Ethereum, Avalanche, Base) using ethers.js v6
// Solana: Solana chain using @solana/web3.js
const ethersAdapter = new EthersAdapter()
const solanaAdapter = new SolanaAdapter()

// Reown's AppKitNetwork type resolves against its bundled viem version, while
// this app pins viem via overrides. The network objects are runtime-compatible,
// but their types are not structurally assignable across those viem versions.
const networks = [mainnet, avalanche, base, solana] as any

/**
 * Global AppKit instance
 * Created once at app initialization, used throughout the app via React hooks
 */
export const appKit = createAppKit({
  adapters: [ethersAdapter, solanaAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
    receive: false,
    send: false,
    email: false,
    socials: false,
    pay: false,
  },
  allowUnsupportedChain: true,
})
