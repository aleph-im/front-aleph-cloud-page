import {
  AppKit,
  CaipNetwork,
  Provider,
  CombinedProvider,
  createAppKit,
} from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'

import { BaseConnectionProviderManager, BlockchainId, ProviderId } from './base'
import { Future, Mutex } from '@/helpers/utils'
import Err from '@/helpers/errors'

export class WalletConnectConnectionProviderManager extends BaseConnectionProviderManager {
  protected providerId = ProviderId.WalletConnect
  protected chains!: CaipNetwork[]
  protected modal?: AppKit
  protected provider?: Provider | CombinedProvider
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
    console.log('ON CONNECT')

    this.connectModalFuture = new Future()

    await this.modal?.open()
    await this.connectModalFuture.promise
    await this.modal?.close()
  }

  async onDisconnect(): Promise<void> {
    console.log('ON DISCONNECT')

    if (this.modal?.getIsConnectedState() && this.provider)
      await this.provider.emit('disconnect')
    if (this.modal?.getState().open) await this.modal.close()

    this.provider = undefined
    this.prevChainId = undefined
    this.prevAddress = undefined
    this.connectModalFuture = undefined
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
    provider?: Provider | CombinedProvider
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
    if (data.event === 'CONNECT_SUCCESS') {
      const provider = this.modal?.getConnectors().filter(
        (connector: any) => connector.name === data.properties.name,
      )?.[0].provider

      this.handleProvider({
        provider: provider as Provider,
      })

      console.log('USING PROVIDER: ', this.provider)
      this.provider?.on('connect', (connect: any) => {
        console.log('Provider connect:', connect)
      })

      this.provider?.on('disconnect', (disconnect: any) => {
        console.log('Provider disconnect:', disconnect)
      })

      this.provider?.on('chainChanged', (chainChanged: any) => {
        console.log('Provider chainChanged:', chainChanged)
      })

      this.provider?.on('accountsChanged', (accountsChanged: any) => {
        console.log('Provider accountsChanged:', accountsChanged)
      })

      this.provider?.on('message', (message: any) => {
        console.log('Provider message:', message)
      })
    }

    // if (data.event === 'MODAL_CLOSE' && !data.properties.connected) {
    //   if (this.connectModalFuture) {
    //     const future = this.connectModalFuture
    //     this.connectModalFuture = undefined
    //     future.reject(Err.UserCancelled)
    //   }

    //   this.disconnect()
    // }

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

    this.chains = [
      {
        id: 'eip155:1',
        chainId: 1,
        chainNamespace: 'eip155',
        name: 'Ethereum',
        currency: 'ETH',
        explorerUrl: 'https://etherscan.io/',
        rpcUrl: 'https://eth.drpc.org',
      },
      {
        id: 'eip155:43114',
        chainId: 43114,
        chainNamespace: 'eip155',
        name: 'Avalanche',
        currency: 'AVAX',
        explorerUrl: 'https://snowtrace.io/',
        rpcUrl: 'https://avalanche.drpc.org',
      },
      {
        id: 'eip155:8453',
        chainId: 8453,
        chainNamespace: 'eip155',
        name: 'Base',
        currency: 'ETH',
        explorerUrl: 'https://basescan.org',
        rpcUrl: 'https://mainnet.base.org',
      },
      // {
      //   id: 'solana:900',
      //   chainId: 900,
      //   chainNamespace: 'solana',
      //   name: 'Solana',
      //   currency: 'SOL',
      //   explorerUrl: 'https://explorer.solana.com/',
      //   rpcUrl: 'https://api.mainnet-beta.solana.com',
      // },
    ]

    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string
    const metadata = {
      name: 'Aleph.im',
      description: 'Aleph.im: Web3 cloud solution',
      url: 'https://account.aleph.im',
      icons: ['https://account.aleph.im/favicon-32x32.png'],
    }
    this.modal = createAppKit({
      adapters: [new Ethers5Adapter()],
      metadata: metadata,
      networks: this.chains,
      projectId,
      features: {
        analytics: false,
        onramp: false,
        email: false,
        socials: false,
      },
    })

    this.modal.subscribeEvents(this.handleEvent)
    this.modal.subscribeState((...e) => {
      const chainId = e[0].selectedNetworkId
        ? parseInt(e[0].selectedNetworkId?.split(':')[1])
        : undefined
      this.handleProvider({
        provider: this.provider,
        chainId: chainId,
      })
    })
    this.modal.subscribeWalletInfo(this.handleWalletInfo)
  }

  protected getProvider(): Provider | CombinedProvider {
    if (!this.provider) throw Err.WalletConnectNotInitialized
    return this.provider
  }
}
