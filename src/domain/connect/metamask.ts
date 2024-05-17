import { BaseConnectionProviderManager, BlockchainId, ProviderId } from './base'
import { MetaMaskInpageProvider } from '@metamask/providers'

export class MetamaskConnectionProviderManager extends BaseConnectionProviderManager {
  protected providerId = ProviderId.Metamask
  protected handleAccountChange = this.onAccount.bind(this)
  protected handleBlockchainChange = this.onBlockchain.bind(this) as any
  protected handleDisconnect = this.disconnect.bind(this, undefined)

  async isConnected(): Promise<boolean> {
    return !!window.ethereum?.isMetaMask
  }

  async onConnect(blockchainId: BlockchainId): Promise<void> {
    const provider = this.getProvider()

    provider.on('accountsChanged', this.handleAccountChange)
    provider.on('chainChanged', this.handleBlockchainChange)
    provider.on('disconnect', this.handleDisconnect)
  }

  async onDisconnect(): Promise<void> {
    const provider = this.getProvider()

    provider.off('accountsChanged', this.handleAccountChange)
    provider.off('chainChanged', this.handleBlockchainChange)
    provider.off('disconnect', this.handleDisconnect)
  }

  protected getProvider(): MetaMaskInpageProvider {
    const provider = window.ethereum as any as MetaMaskInpageProvider
    if (!provider) throw new Error('Metamask is not installed')
    return provider
  }
}
