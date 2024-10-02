export {}

declare global {
  interface Window {
    ethereum: import('ethers5').providers.ExternalProvider
    phantom: window.phantom
    //helia: import('@helia/interface').Helia | undefined
  }
}
