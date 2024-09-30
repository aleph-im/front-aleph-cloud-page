export {}

declare global {
  interface Window {
    ethereum: import('ethers5').providers.ExternalProvider
    //helia: import('@helia/interface').Helia | undefined
  }
}
