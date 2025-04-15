import { BaseConnectionProviderManager, BlockchainId, ProviderId } from './base'
import { MetamaskConnectionProviderManager } from './metamask'
import { PhantomConnectionProviderManager } from './phantom'
import { ReownConnectionProviderManager } from './reown'
import { WalletConnectConnectionProviderManager } from './walletConnect.old'

export class ConnectionProviderManager {
  constructor(
    private providers: Record<string, BaseConnectionProviderManager>,
  ) {}

  public of(providerId: ProviderId): BaseConnectionProviderManager {
    return this.providers[providerId]
  }
}

// @todo: move to global state
export const connectionProviderManager = new ConnectionProviderManager({
  [ProviderId.Metamask]: new MetamaskConnectionProviderManager([
    BlockchainId.ETH,
    BlockchainId.AVAX,
    BlockchainId.BASE,
  ]),
  // [ProviderId.WalletConnect]: new WalletConnectConnectionProviderManager([
  //   BlockchainId.ETH,
  //   BlockchainId.AVAX,
  //   BlockchainId.BASE,
  // ]),
  [ProviderId.Reown]: new ReownConnectionProviderManager([
    BlockchainId.ETH,
    BlockchainId.AVAX,
    BlockchainId.BASE,
  ]),
  [ProviderId.Phantom]: new PhantomConnectionProviderManager([
    BlockchainId.SOL,
  ]),
})
