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
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { mainnet, avalanche, base, solana } from '@reown/appkit/networks'

// WalletConnect project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string

// Application metadata shown in wallet connection UI
const metadata = {
  name: 'Aleph Cloud',
  description: 'Aleph Cloud: Web3 cloud solution',
  url: 'https://account.aleph.im',
  icons: ['https://account.aleph.im/favicon-32x32.png'],
}

// Adapters for different blockchain ecosystems
// Ethers5: EVM chains (Ethereum, Avalanche, Base) using ethers.js v5
// Solana: Solana chain using @solana/web3.js
const ethers5Adapter = new Ethers5Adapter()
const solanaAdapter = new SolanaAdapter()

/**
 * Global AppKit instance
 * Created once at app initialization, used throughout the app via React hooks
 */
export const appKit = createAppKit({
  adapters: [ethers5Adapter, solanaAdapter],
  networks: [mainnet, avalanche, base, solana],
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
})
