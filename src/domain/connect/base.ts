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
import { getAccountFromProvider as getAVAXAccount } from '@aleph-sdk/avalanche'
import { getAccountFromProvider as getBASEAccount } from '@aleph-sdk/base'
import {
  createFromEVMAccount,
  isAccountSupported as isAccountPAYGCompatible,
} from '@aleph-sdk/superfluid'
import { Mutex, getERC20Balance, getSOLBalance, sleep } from '@/helpers/utils'
import { MetaMaskInpageProvider } from '@metamask/providers'
import {
  Provider as AppKitProvider,
  CombinedProvider as AppKitCombinedProvider,
} from '@reown/appkit/react'
import Err from '@/helpers/errors'
import { EVMAccount, findChainDataByChainId } from '@aleph-sdk/evm'
import { MetamaskErrorCodes } from './constants'

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
  [BlockchainId.BASE]: {
    id: BlockchainId.BASE,
    name: 'Base',
    chainId: 8453,
    eip155: true,
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org',
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
    | AppKitProvider
    | AppKitCombinedProvider
    | MetaMaskInpageProvider

  async connect(blockchainId: BlockchainId): Promise<void> {
    const release = await this.mutex.acquire()

    console.log('CONNECTING')

    try {
      const blockchain = this.getBlockchainData(blockchainId)

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
    console.log('DISCONECTING BECAUSE: ', error)
    const release = await this.mutex.acquire()
    console.log('DISCONNECTING')
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

    console.log('UPDATING')

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

      case BlockchainId.BASE:
        return getBASEAccount(provider as any)

      case BlockchainId.SOL:
        return getSOLAccount(provider as any)

      default:
        throw Err.ChainNotYetSupported
    }
  }

  async getBalance(account: Account): Promise<number> {
    if (isAccountPAYGCompatible(account)) {
      try {
        const superfluidAccount = await createFromEVMAccount(
          account as EVMAccount,
        )
        const balance = await superfluidAccount.getALEPHBalance()
        return balance.toNumber()
      } catch (e) {
        console.error(e)
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
