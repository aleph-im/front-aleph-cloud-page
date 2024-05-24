import EventEmitter from 'events'
import { Blockchain as BlockchainId } from '@aleph-sdk/core'
import { Account } from '@aleph-sdk/account'
import {
  getAccountFromProvider as getETHAccount,
  ETHAccount,
} from '@aleph-sdk/ethereum'
import {
  getAccountFromProvider as getSOLAccount,
  SOLAccount,
} from '@aleph-sdk/solana'
import {
  getAccountFromProvider as getAVAXAccount,
  AvalancheAccount,
} from '@aleph-sdk/avalanche'
import { createFromAvalancheAccount } from '@aleph-sdk/superfluid'
import { Mutex, getERC20Balance, getSOLBalance, sleep } from '@/helpers/utils'
import { MetaMaskInpageProvider } from '@metamask/providers'
import type {
  Provider as EthersProvider,
  CombinedProvider,
} from '@web3modal/scaffold-utils/ethers'
import Err from '@/helpers/errors'

export { BlockchainId }

// ------------------------

export enum ProviderId {
  Metamask = 'metamask',
  WalletConnect = 'wallet-connect',
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
}

// ------------------------

export type Blockchain = {
  id: BlockchainId
  name: string
  chainId: number
  eip155: boolean
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
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io/',
    rpcUrl: 'https://eth.drpc.org',
  },
  [BlockchainId.AVAX]: {
    id: BlockchainId.AVAX,
    name: 'Avalanche',
    chainId: 43114,
    eip155: true,
    currency: 'AVAX',
    explorerUrl: 'https://snowtrace.io/',
    rpcUrl: 'https://avalanche.drpc.org',
  },
  [BlockchainId.SOL]: {
    id: BlockchainId.SOL,
    name: 'Solana',
    chainId: 900,
    eip155: false,
    currency: 'SOL',
  },
} as Record<BlockchainId, Blockchain>

export const networks: Record<number, Blockchain> = {
  1: blockchains.ETH,
  43114: blockchains.AVAX,
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

  async connect(blockchainId: BlockchainId): Promise<void> {
    const release = await this.mutex.acquire()

    try {
      const blockchain = blockchains[blockchainId]

      if (!this.supportedBlockchains.includes(blockchainId)) {
        throw Err.BlockchainNotSupported(blockchain?.name || blockchainId)
      }

      await this.onConnect(blockchainId)
      this.events.emit('connect', { provider: this.providerId })

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
    const prevBlockchain = await this.getBlockchain().catch(() => undefined)
    if (prevBlockchain === blockchainId) return

    try {
      const blockchain = blockchains[blockchainId]
      if (!blockchain) throw Err.BlockchainNotSupported(blockchainId)

      const provider = this.getProvider()
      const chainId = `0x${blockchain.chainId.toString(16)}`

      await provider.request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
    } catch (e) {
      await this.onUpdate(prevBlockchain)
      throw e
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

    switch (blockchainId) {
      case BlockchainId.ETH:
        return getETHAccount(provider as any)

      case BlockchainId.AVAX:
        return getAVAXAccount(provider as any)

      case BlockchainId.SOL:
        return getSOLAccount(provider as any)

      default:
        throw Err.ChainNotYetSupported
    }
  }

  async getBalance(account: Account): Promise<number> {
    if (account instanceof AvalancheAccount) {
      const superfluidAccount = createFromAvalancheAccount(account)
      try {
        const balance = await superfluidAccount.getALEPHBalance()
        return balance.toNumber()
      } catch {
        return 0
      }
    }
    if (account instanceof ETHAccount) {
      return getERC20Balance(account.address)
    }
    if (account instanceof SOLAccount) {
      return getSOLBalance(account.address)
    }

    throw Err.ChainNotYetSupported
  }
}
