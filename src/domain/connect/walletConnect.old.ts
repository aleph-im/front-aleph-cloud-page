import {
  BaseConnectionProviderManager,
  BlockchainId,
  ProviderId,
  blockchains,
} from './base'
import { Future, Mutex } from '@/helpers/utils'
import Err from '@/helpers/errors'
// import { Web3Modal, createWeb3Modal, defaultConfig } from '@web3modal/ethers5'
// import type {
//   Provider as EthersProvider,
//   CombinedProvider,
//   Chain,
// } from '@web3modal/scaffold-utils/ethers'
import { AppKit, createAppKit } from '@reown/appkit/react'
import { Chain, mainnet } from '@reown/appkit/networks'
import {
  CombinedProvider,
  Ethers5Adapter,
  Provider as EthersProvider,
} from '@reown/appkit-adapter-ethers5'

export class WalletConnectConnectionProviderManager extends BaseConnectionProviderManager {
  protected providerId = ProviderId.WalletConnect
  protected chains!: Chain[]
  protected modal?: AppKit
  protected provider?: EthersProvider | CombinedProvider
  protected connectModalFuture?: Future<void>
  protected prevAddress?: string
  protected prevChainId?: number
  protected mutex = new Mutex()
  protected handleEvent = this.onEvent.bind(this)
  protected handleProvider = this.onProvider.bind(this)
  protected handleWalletInfo = this.onWalletInfo.bind(this)

  async isConnected(): Promise<boolean> {
    return !!this.provider
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onConnect(blockchainId: BlockchainId): Promise<void> {
    await this.init()

    this.connectModalFuture = new Future()

    await this.modal?.open()
    await this.connectModalFuture.promise
    await this.modal?.close()
  }

  async onDisconnect(): Promise<void> {
    if (this.modal?.getIsConnectedState()) await this.modal.disconnect()
    if (this.modal?.getState().open) await this.modal.close()

    this.provider = undefined
    this.prevChainId = undefined
    this.prevAddress = undefined
  }

  protected onWalletInfo(info: any) {
    if (!info) {
      this.disconnect()
      return
    }
  }

  protected onProvider({
    provider,
    address,
    chainId,
  }: {
    provider?: EthersProvider | CombinedProvider
    address?: any
    chainId?: number
  }) {
    this.provider = provider

    if (this.prevChainId !== chainId && chainId) {
      this.prevChainId = chainId
      this.onBlockchain(chainId).catch(() => 'ignore')
    }

    if (this.prevAddress !== address && address) {
      this.prevAddress = address
      this.onAccount().catch(() => 'ignore')
    }

    this.prevChainId = chainId
    this.prevAddress = address

    if (this.provider && this.connectModalFuture) {
      const future = this.connectModalFuture
      this.connectModalFuture = undefined
      future.resolve()
    }
  }

  protected async onEvent({ data }: any) {
    console.log("onEvent data", data)
    if (data.event === 'MODAL_CLOSE' && !data.properties.connected) {
      if (this.connectModalFuture) {
        const future = this.connectModalFuture
        this.connectModalFuture = undefined
        future.reject(Err.UserCancelled)
      }

      this.disconnect()
    }

    if (data.event === 'MODAL_OPEN') {
      if (!!data.properties.connected) {
        this.modal?.close()
        return
      }

      // const state = this.modal.getState()
      // const isSupported =
      //   !state.selectedNetworkId ||
      //   this.chains.some((c) => c.chainId === state.selectedNetworkId)

      // if (!isSupported) this.modal.close()
    }
  }

  protected async init(): Promise<void> {
    if (this.modal) return

    // this.chains = Object.values(blockchains)
    //   .filter((b) => b.eip155 && this.supportedBlockchains.includes(b.id))
    //   .map((b) => {
    //     return {
    //       chainId: b.chainId,
    //       name: b.name,
    //       currency: b.currency,
    //       explorerUrl: b.explorerUrl as string,
    //       rpcUrl: b.rpcUrl as string,
    //     }
    //   })

    // const ethersConfig = defaultConfig({
    // metadata: {
    //   name: 'Aleph Cloud',
    //   description: 'Aleph Cloud: Web3 cloud solution',
    //   url: 'https://account.aleph.im',
    //   icons: ['https://account.aleph.im/favicon-32x32.png'],
    //   },
    //   enableEIP6963: true,
    //   enableInjected: true,
    //   enableCoinbase: false,
    // })

    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string
    const metadata = {
      name: 'Aleph Cloud',
      description: 'Aleph Cloud: Web3 cloud solution',
      url: 'https://account.aleph.im',
      icons: ['https://account.aleph.im/favicon-32x32.png'],
    }

    // this.modal = createWeb3Modal({
    //   ethersConfig,
    //   chains: this.chains,
    //   projectId,
    //   enableAnalytics: false,
    //   enableOnramp: false,
    // })

    this.modal = createAppKit({
      adapters: [new Ethers5Adapter()],
      networks: [mainnet],
      metadata,
      projectId,
      features: {
        analytics: false,
        onramp: false,
      },
    })

    this.modal.subscribeEvents(this.handleEvent)
    // this.modal.subscribeProviders(this.handleProvider)
    this.modal.subscribeProviders((props) => {
      console.log('subscribeProviders', props)
      console.log('subscribeProviders info', props)
    })
    this.modal.subscribeWalletInfo(this.handleWalletInfo)
  }

  protected getProvider(): EthersProvider | CombinedProvider {
    if (!this.provider) throw Err.WalletConnectNotInitialized
    return this.provider
  }
}
