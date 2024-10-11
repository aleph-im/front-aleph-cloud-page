import { WindowPhantomProvider } from './types'

export {}

declare global {
  interface Window {
    ethereum: import('ethers').providers.ExternalProvider
    phantom: {
      solana: WindowPhantomProvider
    }
    solana: WindowPhantomProvider
  }
}
