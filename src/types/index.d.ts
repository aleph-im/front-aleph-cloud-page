export {}

declare global {
  interface Window {
    ethereum: import('ethers').providers.ExternalProvider
    phantom: {
      solana: PhantomProvider
    }
    solana: PhantomProvider
  }
}
