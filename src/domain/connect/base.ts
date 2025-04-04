import EventEmitter from 'events'
import { Blockchain as BlockchainId } from '@aleph-sdk/core'
import { Account } from '@aleph-sdk/account'
import { getAccountFromProvider as getETHAccount } from '@aleph-sdk/ethereum'
import { getAccountFromProvider as getSOLAccount } from '@aleph-sdk/solana'
import { getAccountFromProvider as getAVAXAccount } from '@aleph-sdk/avalanche'
import { getAccountFromProvider as getBASEAccount } from '@aleph-sdk/base'
import { Mutex, getAccountBalance, sleep } from '@/helpers/utils'
import { MetaMaskInpageProvider } from '@metamask/providers'
import type {
  Provider as EthersProvider,
  CombinedProvider,
} from '@web3modal/scaffold-utils/ethers'
import Err from '@/helpers/errors'
import { findChainDataByChainId } from '@aleph-sdk/evm'
import { MetamaskErrorCodes } from './constants'
import { WindowPhantomProvider as PhantomProvider } from '@/types/types'
import { PaymentMethod } from '@/helpers/constants'

export { BlockchainId }

// ------------------------

export enum ProviderId {
  Metamask = 'metamask',
  WalletConnect = 'wallet-connect',
  Phantom = 'phantom',
}

export type Provider = {
  id: ProviderId
  name: string
}

export const providers: Record<ProviderId, Provider> = {
  [ProviderId.Metamask]: {
    id: ProviderId.Metamask,
    name: 'Metamask',
  },
  [ProviderId.WalletConnect]: {
    id: ProviderId.WalletConnect,
    name: 'WalletConnect',
  },
  [ProviderId.Phantom]: {
    id: ProviderId.Phantom,
    name: 'Phantom',
  },
}

export const defaultBlockchainProviders: Record<BlockchainId, ProviderId> = {
  [BlockchainId.ETH]: ProviderId.WalletConnect,
  [BlockchainId.AVAX]: ProviderId.WalletConnect,
  [BlockchainId.BASE]: ProviderId.WalletConnect,
  [BlockchainId.SOL]: ProviderId.Phantom,
} as Record<BlockchainId, ProviderId>

// ------------------------

export type Blockchain = {
  id: BlockchainId
  name: string
  chainId: number
  eip155: boolean
  solana: boolean
  currency: string
  explorerUrl?: string
  rpcUrl?: string
}

export const blockchains: Record<BlockchainId, Blockchain> = {
  [BlockchainId.ETH]: {
    id: BlockchainId.ETH,
    name: 'Ethereum',
    chainId: 1,
    eip155: true,
    solana: false,
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io/',
    rpcUrl: 'https://eth.drpc.org',
  },
  [BlockchainId.AVAX]: {
    id: BlockchainId.AVAX,
    name: 'Avalanche',
    chainId: 43114,
    eip155: true,
    solana: false,
    currency: 'AVAX',
    explorerUrl: 'https://subnets.avax.network/c-chain/',
    rpcUrl: 'https://avalanche.drpc.org',
  },
  [BlockchainId.BASE]: {
    id: BlockchainId.BASE,
    name: 'Base',
    chainId: 8453,
    eip155: true,
    solana: false,
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org',
  },
  [BlockchainId.SOL]: {
    id: BlockchainId.SOL,
    name: 'Solana',
    chainId: 900,
    eip155: false,
    solana: true,
    currency: 'SOL',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com/',
  },
} as Record<BlockchainId, Blockchain>

export const networks: Record<number, Blockchain> = {
  1: blockchains.ETH,
  43114: blockchains.AVAX,
  8453: blockchains.BASE,
  900: blockchains.SOL,
}

// ------------------------

export abstract class BaseConnectionProviderManager {
  public events: EventEmitter = new EventEmitter()

  protected providerId!: ProviderId
  protected mutex = new Mutex()
  protected isReady = false

  constructor(protected supportedBlockchains: BlockchainId[]) {}

  abstract isConnected(): Promise<boolean>
  protected abstract onConnect(blockchainId: BlockchainId): Promise<void>
  protected abstract onDisconnect(): Promise<void>
  protected abstract getProvider():
    | EthersProvider
    | CombinedProvider
    | MetaMaskInpageProvider
    | PhantomProvider

  async connect(blockchainId: BlockchainId): Promise<void> {
    const release = await this.mutex.acquire()

    try {
      const blockchain = this.getBlockchainData(blockchainId)
      if (!this.supportedBlockchains.includes(blockchainId)) {
        throw Err.BlockchainNotSupported(blockchain?.name || blockchainId)
      }

      await this.onConnect(blockchainId)

      this.isReady = true
      await this.switchBlockchain(blockchainId)
      await this.onUpdate(blockchainId)
    } finally {
      release()
    }
  }

  async disconnect(error?: Error): Promise<void> {
    const release = await this.mutex.acquire()

    try {
      this.isReady = false

      await this.onDisconnect()
      this.events.emit('disconnect', { provider: this.providerId, error })
    } finally {
      release()
    }
  }

  async switchBlockchain(blockchainId: BlockchainId): Promise<void> {
    const prevBlockchain = await this.getPreviousBlockchain()
    if (prevBlockchain === blockchainId) return

    const blockchain = this.getBlockchainData(blockchainId)

    const provider = this.getProvider()
    const chainIdHex = `0x${blockchain.chainId.toString(16)}`

    try {
      await this.switchBlockchainRequest(provider, chainIdHex)
    } catch (error) {
      await this.handleSwitchError(
        error as any,
        provider,
        blockchain,
        chainIdHex,
        prevBlockchain,
      )
    }
  }

  protected async onUpdate(blockchainId?: BlockchainId): Promise<void> {
    if (!this.isReady) return

    const blockchain = blockchainId || (await this.getBlockchain())
    const account = await this.getAccount()
    const balance = await this.getBalance(account)

    this.events.emit('update', {
      provider: this.providerId,
      blockchain,
      account,
      balance,
    })
  }

  protected async onBlockchain(chainId: string | number): Promise<void> {
    if (!this.isReady) return

    chainId =
      typeof chainId === 'string' ? parseInt(chainId as string, 16) : chainId

    const blockchain = networks[chainId]
    const blockchainId = blockchain?.id

    if (!this.supportedBlockchains.includes(blockchainId)) {
      await sleep(0)

      await this.onDisconnect()
      this.events.emit('disconnect', {
        provider: this.providerId,
        error: Err.BlockchainNotSupported(blockchain?.name || chainId),
      })
      return
    }

    return this.onUpdate(blockchainId)
  }

  protected async onAccount(): Promise<void> {
    return this.onUpdate()
  }

  protected async getBlockchain(): Promise<BlockchainId> {
    const provider = this.getProvider()

    let chainId = (await provider.request?.({
      method: 'eth_chainId',
    })) as number | string

    chainId = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId

    const blockchain = networks[chainId]
    if (!blockchain) throw Err.BlockchainNotSupported(chainId)

    return blockchain.id
  }

  protected async getAccount(): Promise<Account> {
    const provider = this.getProvider()
    const blockchainId = await this.getBlockchain()

    let account: any

    switch (blockchainId) {
      case BlockchainId.ETH:
        account = await getETHAccount(provider as any)
        break

      case BlockchainId.AVAX:
        account = await getAVAXAccount(provider as any)
        break

      case BlockchainId.BASE:
        account = await getBASEAccount(provider as any)
        break

      case BlockchainId.SOL:
        account = await getSOLAccount(provider as any)
        break

      default:
        throw Err.ChainNotYetSupported
    }

    // account.address = '0x000'
    return account
  }

  async getBalance(account: Account): Promise<number> {
    return getAccountBalance(account, PaymentMethod.Hold)
  }

  private async getPreviousBlockchain(): Promise<BlockchainId | undefined> {
    try {
      return await this.getBlockchain()
    } catch {
      return undefined
    }
  }

  private getBlockchainData(blockchainId: BlockchainId): Blockchain {
    const blockchain = blockchains[blockchainId]
    if (!blockchain) throw Err.BlockchainNotSupported(blockchainId)
    return blockchain
  }

  private async handleSwitchError(
    error: { code?: number; message?: string },
    provider: any,
    blockchain: Blockchain,
    chainIdHex: string,
    prevBlockchain?: BlockchainId,
  ): Promise<void> {
    if (error?.code === MetamaskErrorCodes.UNRECOGNIZED) {
      try {
        await this.addBlockchain(provider, blockchain.chainId)
        await this.switchBlockchainRequest(provider, chainIdHex)
      } catch (e) {
        await this.onUpdate(prevBlockchain)
        console.warn(
          `[Add & Switch Network]: ${(e as { code?: number; message?: string })?.message}`,
        )
      }
    } else if (error?.code === MetamaskErrorCodes.REJECTED) {
      await this.onUpdate(prevBlockchain)
      console.warn(`[Switch Network]: ${error?.message}`)
    } else {
      await this.onUpdate(prevBlockchain)
      throw new Error(`[Switch Network]: ${error?.message}`)
    }
  }

  private async switchBlockchainRequest(
    provider: any,
    chainId: string,
  ): Promise<void> {
    await provider.request?.({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    })
  }

  private async addBlockchain(provider: any, chainId: number): Promise<void> {
    const chainData = findChainDataByChainId(chainId)

    await provider.request?.({
      method: 'wallet_addEthereumChain',
      params: [chainData],
    })
  }
}
