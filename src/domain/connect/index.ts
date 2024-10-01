import { BaseConnectionProviderManager, BlockchainId, ProviderId } from './base'
import { MetamaskConnectionProviderManager } from './metamask'
import { WalletConnectConnectionProviderManager } from './walletConnect'

export class ConnectionProviderManager {
  constructor(
    private supportedBlockchains: BlockchainId[],
    private providers: Record<string, BaseConnectionProviderManager> = {
      [ProviderId.Metamask]: new MetamaskConnectionProviderManager(
        supportedBlockchains,
      ),
      [ProviderId.WalletConnect]: new WalletConnectConnectionProviderManager(
        supportedBlockchains,
      ),
    },
  ) {}

  public of(providerId: ProviderId): BaseConnectionProviderManager {
    return this.providers[providerId]
  }
}

// @todo: move to global state
export const connectionProviderManager = new ConnectionProviderManager([
  BlockchainId.ETH,
  BlockchainId.AVAX,
  BlockchainId.BASE,
  BlockchainId.SOL,
])
