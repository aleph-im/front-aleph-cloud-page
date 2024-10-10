import { WindowPhantomProvider as PhantomProvider } from '@/types/types'
import { BaseConnectionProviderManager, BlockchainId, ProviderId } from './base'
import Err from '@/helpers/errors'

export class PhantomConnectionProviderManager extends BaseConnectionProviderManager {
  protected providerId = ProviderId.Phantom
  protected provider?: PhantomProvider
  protected handleAccountChange = this.onAccount.bind(this)
  protected handleBlockchainChange = this.onBlockchain.bind(this) as any
  protected handleDisconnect = this.disconnect.bind(this, undefined)

  async isConnected(): Promise<boolean> {
    return !!this.getProvider()?.isConnected
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onConnect(blockchainId: BlockchainId): Promise<void> {
    await this.init()

    const provider = this.getProvider()

    provider.off('accountsChanged', this.handleAccountChange)
    provider.on('disconnect', this.handleDisconnect)
  }

  async onDisconnect(): Promise<void> {
    const provider = this.getProvider()

    provider.on('accountsChanged', this.handleAccountChange)
    provider.off('disconnect', this.handleDisconnect)
  }

  protected async init(): Promise<void> {
    if (this.provider) return

    this.provider = window.phantom?.solana
  }

  protected async getBlockchain(): Promise<BlockchainId> {
    return BlockchainId.SOL
  }

  protected getProvider(): PhantomProvider {
    if (!this.provider) throw Err.PhantomNotInitialized

    return this.provider
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async switchBlockchain(blockchainId: BlockchainId): Promise<void> {
    return
  }
}
