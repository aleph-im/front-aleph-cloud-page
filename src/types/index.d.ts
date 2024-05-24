export {}

declare global {
  interface Window {
    ethereum: import('ethers').providers.ExternalProvider
    //helia: import('@helia/interface').Helia | undefined
  }
}
