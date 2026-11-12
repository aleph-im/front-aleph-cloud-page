import { WindowPhantomProvider } from './types'

export {}

declare global {
  interface Window {
    ethereum: import('ethers').Eip1193Provider
    phantom: {
      solana: WindowPhantomProvider
    }
    solana: WindowPhantomProvider
  }
}
