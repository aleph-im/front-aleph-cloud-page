import { isBlockchainSupported as isPAYGCompatible } from '@aleph-sdk/superfluid'
import { BlockchainId } from './connect/base'

export function isBlockchainPAYGCompatible(blockchain?: BlockchainId): boolean {
  return isPAYGCompatible(blockchain)
}

export function isBlockchainHoldingCompatible(
  blockchain?: BlockchainId,
): boolean {
  if (!blockchain) return false

  return [
    BlockchainId.ETH,
    BlockchainId.AVAX,
    BlockchainId.BASE,
    BlockchainId.SOL,
  ].includes(blockchain)
}
