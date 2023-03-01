import {
  Chain,
  MessageType,
  ProgramMessage,
} from "aleph-sdk-ts/dist/messages/message";
import { Account } from "aleph-sdk-ts/dist/accounts/account";
import { any } from "aleph-sdk-ts/dist/messages";
import { GetAccountFromProvider as getETHAccount } from "aleph-sdk-ts/dist/accounts/ethereum";
import { GetAccountFromProvider as getSOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { getERC20Balance, getSOLBalance, msgIsFunction } from "./utils";
import E_ from "./errors";

/**
 * Connects to a web3 provider and returns an Aleph account object
 *
 * @param chain The chain to connect to
 * @param provider A web3 provider (ex: window.ethereum)
 */
export const web3Connect = (chain: Chain, provider: any): Promise<Account> => {
  switch (chain) {
    case Chain.ETH:
      return getETHAccount(provider);

    case Chain.SOL:
      return getSOLAccount(provider);

    default:
      throw E_.ChainNotYetSupported;
  }
};

/**
 * Returns the Aleph token balance of an account using the default RPC method for the chain
 *
 * @param account An Aleph account object
 * @returns The Aleph balance of the account
 */
export const getAccountBalance = async (account: Account): Promise<number> => {
  switch (account.GetChain()) {
    case Chain.ETH:
      return getERC20Balance(account.address);

    case Chain.SOL:
      return getSOLBalance(account.address);

    default:
      throw E_.ChainNotYetSupported;
  }
};

export const getAccountProducts = async (account: Account) => {
  let query;
  try {
    query = await any.GetMessages({
      addresses: [account.address],
      messageType: MessageType.program,
      pagination: 1000, // FIXME
    });
  } catch (error) {
    throw E_.RequestFailed(error);
  }
  const products: Record<string, ProgramMessage[]> = {
    databases: [],
    instances: [],
    functions: [],
  };

  query.messages.forEach((msg) => {
    if (msgIsFunction(msg as ProgramMessage)) {
      products.functions.push(msg as ProgramMessage);
    } else {
      products.instances.push(msg as ProgramMessage);
    }
  });

  return products;
};

export const createInstance = async (account: Account) => {};

export const createFunction = async (account: Account) => {};
