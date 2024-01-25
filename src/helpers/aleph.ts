import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { GetAccountFromProvider as getETHAccount } from 'aleph-sdk-ts/dist/accounts/ethereum'
import { GetAccountFromProvider as getSOLAccount } from 'aleph-sdk-ts/dist/accounts/solana'
import {
  GetAccountFromProvider as getAVAXAccount,
  SuperfluidAccount,
  createFromAvalancheAccount,
} from 'aleph-sdk-ts/dist/accounts/superfluid'
import { AvalancheAccount } from 'aleph-sdk-ts/dist/accounts/avalanche'
import { RpcId } from 'aleph-sdk-ts/dist/accounts/providers/JsonRPCWallet'
import { getERC20Balance, getSOLBalance } from './utils'
import E_ from './errors'

/**
 * Connects to a web3 provider and returns an Aleph account object
 *
 * @param chain The chain to connect to
 * @param provider A web3 provider (ex: window.ethereum)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const web3Connect = (chain: Chain, provider: any): Promise<Account> => {
  switch (chain) {
    case Chain.ETH:
      return getETHAccount(provider)

    case Chain.AVAX:
      return getAVAXAccount(provider)

    case Chain.SOL:
      return getSOLAccount(provider)

    default:
      throw E_.ChainNotYetSupported
  }
}

/**
 * Returns the Aleph token balance of an account using the default RPC method for the chain
 *
 * @param account An Aleph account object
 * @returns The Aleph balance of the account
 */
export const getAccountBalance = async (account: Account): Promise<number> => {
  switch (account.GetChain()) {
    case Chain.ETH:
      return getERC20Balance(account.address)

    case Chain.AVAX:
      if (account instanceof SuperfluidAccount) {
        return (await account.getALEPHxBalance()).toNumber()
      }
      if (account instanceof AvalancheAccount) {
        const superfluidAccount = await createFromAvalancheAccount(account)
        return (await superfluidAccount.getALEPHxBalance()).toNumber()
      }
      throw E_.ChainNotYetSupported

    case Chain.SOL:
      return getSOLBalance(account.address)

    default:
      throw E_.ChainNotYetSupported
  }
}
