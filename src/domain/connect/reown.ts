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
import { AppKit, CaipNetwork, createAppKit } from '@reown/appkit/react'
import { AppKitNetwork, Chain, mainnet } from '@reown/appkit/networks'
import {
  CombinedProvider,
  Ethers5Adapter,
  Provider as EthersProvider,
} from '@reown/appkit-adapter-ethers5'

export class ReownConnectionProviderManager extends BaseConnectionProviderManager {
  protected providerId = ProviderId.Reown
  protected chains!: CaipNetwork[]
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
    console.log('data event', data.event)
    console.log('data properties', data.properties)

    if (data.event === 'MODAL_CLOSE' && !data.properties.connected) {
      console.log('MODAL_CLOSE')

      if (this.connectModalFuture) {
        console.log('MODAL_CLOSE reject')
        const future = this.connectModalFuture
        this.connectModalFuture = undefined
        future.reject(Err.UserCancelled)
      }

      console.log('MODAL_CLOSE disconnect')
      this.disconnect()
    }

    if (data.event === 'MODAL_OPEN') {
      console.log('MODAL_OPEN')

      if (!!data.properties.connected) {
        console.log('MODAL_OPEN close')
        this.modal?.close()
        return
      }

      console.log('MODAL_OPEN check network')
      const state = this.modal?.getState()
      console.log('MODAL_OPEN state', state)
      console.log('MODAL_OPEN selectedNetworkId', state?.selectedNetworkId)
      console.log('MODAL_OPEN chains', this.chains)
      const isSupported =
        !state?.selectedNetworkId ||
        this.chains.some((c) => c.caipNetworkId === state.selectedNetworkId)

      console.log('MODAL_OPEN isSupported', isSupported)
      if (!isSupported) this.modal?.close()
    }
  }

  protected async init(): Promise<void> {
    if (this.modal) return

    this.chains = Object.values(blockchains)
      .filter((b) => b.eip155 && this.supportedBlockchains.includes(b.id))
      .map((b) => {
        return {
          id: b.id,
          name: b.name,
          nativeCurrency: {
            name: b.currency,
            symbol: b.currency,
            decimals: 18,
          },
          chainNamespace: b.namespace,
          caipNetworkId: b.caipId,
          rpcUrls: {
            default: {
              http: [b.rpcUrl],
            },
          },
        } as CaipNetwork
      })

    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string
    const metadata = {
      name: 'Aleph Cloud',
      description: 'Aleph Cloud: Web3 cloud solution',
      url: 'https://account.aleph.im',
      icons: ['https://account.aleph.im/favicon-32x32.png'],
    }

    this.modal = createAppKit({
      adapters: [new Ethers5Adapter()],
      networks: [...this.chains] as [AppKitNetwork, ...AppKitNetwork[]],
      metadata,
      projectId,
      features: {
        analytics: false,
        onramp: false,
        socials: false,
        email: false,
      },
    })

    this.modal.subscribeEvents(this.handleEvent)
    this.modal.subscribeProviders((props) => {
      console.log('subscribeProviders', props)
      console.log('subscribeProviders - props.eip155', props.eip155)
      console.log('subscribeProviders - props.solana', props.solana)
      console.log('subscribeProviders - props.polkadot', props.polkadot)
      console.log('subscribeProviders - props.bip122', props.bip122)
    })
    this.modal.subscribeWalletInfo(this.handleWalletInfo)
  }

  protected getProvider(): EthersProvider | CombinedProvider {
    if (!this.provider) throw Err.ReownNotInitialized
    return this.provider
  }
}
