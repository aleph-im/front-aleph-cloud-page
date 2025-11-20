import {
  ChainMetadata,
  ChainMetadataType,
  EVMAccount,
  hexToDec,
  JsonRPCWallet,
  RpcId,
} from '@aleph-sdk/evm'
import { BlockchainId, blockchains } from './index'
import { providers } from 'ethers'

// @note: This is a helper class for being able to query blockchain data using
// an static address different from the one connected on the DAPP
export class StaticEVMAccount extends EVMAccount {
  public wallet: JsonRPCWallet

  constructor(
    public address: string,
    public chain: BlockchainId,
  ) {
    super(address)

    this.wallet = Object.create(JsonRPCWallet.prototype)
    this.wallet.connect = async () => undefined
    this.wallet.getCurrentChainId = async () => this.getChainId()

    const { rpcUrls, chainName, chainId } = this.getChainMetadata()

    const provider = new providers.JsonRpcProvider(rpcUrls.at(0), {
      name: chainName,
      chainId: hexToDec(chainId),
    })

    ;(this.wallet as any).provider = provider
  }

  getChainMetadata(): ChainMetadataType {
    const rpcId =
      this.chain === BlockchainId.AVAX
        ? RpcId.AVAX
        : this.chain === BlockchainId.BASE
          ? RpcId.BASE
          : undefined

    if (!rpcId) throw new Error('Invalid RPC network')

    return ChainMetadata[rpcId]
  }

  async getChainId(): Promise<number> {
    const b = this.getChain()
    return blockchains[b].chainId
  }

  getChain(): BlockchainId {
    return this.chain
  }

  async askPubKey(): Promise<void> {
    return
  }

  async sign(): Promise<string> {
    return ''
  }
}
