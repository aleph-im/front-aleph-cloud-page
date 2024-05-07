import { Blockchain } from '@aleph-sdk/core'
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
  SuperfluidAccount,
  createFromAvalancheAccount,
} from '@aleph-sdk/superfluid'
import { AvalancheAccount } from '@aleph-sdk/avalanche'
import { getERC20Balance, getSOLBalance } from './utils'
import Err from './errors'

/**
 * Connects to a web3 provider and returns an Aleph account object
 *
 * @param chain The chain to connect to
 * @param provider A web3 provider (ex: window.ethereum)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const web3Connect = (
  chain: Blockchain,
  provider: any,
): Promise<Account> => {
  switch (chain) {
    case Blockchain.ETH:
      return getETHAccount(provider)

    case Blockchain.AVAX:
      return getAVAXAccount(provider)

    case Blockchain.SOL:
      return getSOLAccount(provider)

    default:
      throw Err.ChainNotYetSupported
  }
}

/**
 * Returns the Aleph token balance of an account using the default RPC method for the chain
 *
 * @param account An Aleph account object
 * @returns The Aleph balance of the account
 */
export const getAccountBalance = async (account: Account): Promise<number> => {
  if (account instanceof SuperfluidAccount) {
    return (await account.getALEPHBalance()).toNumber()
  }
  if (account instanceof AvalancheAccount) {
    const superfluidAccount = createFromAvalancheAccount(account)
    return (await superfluidAccount.getALEPHBalance()).toNumber()
  }
  if (account instanceof ETHAccount) {
    return getERC20Balance(account.address)
  }
  if (account instanceof SOLAccount) {
    return getSOLBalance(account.address)
  }

  throw Err.ChainNotYetSupported
}
