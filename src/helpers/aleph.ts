import {
  Chain,
  MessageType,
  ProgramMessage,
} from "aleph-sdk-ts/dist/messages/message";
import { Account } from "aleph-sdk-ts/dist/accounts/account";
import { any, program, forget, store } from "aleph-sdk-ts/dist/messages";
import { GetAccountFromProvider as getETHAccount } from "aleph-sdk-ts/dist/accounts/ethereum";
import { GetAccountFromProvider as getSOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import {
  getERC20Balance,
  getFunctionSpecsByComputeUnits,
  getSOLBalance,
} from "./utils";
import E_ from "./errors";
import {
  Encoding,
  MachineVolume,
  PersistentVolume,
} from "aleph-sdk-ts/dist/messages/program/programModel";

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

/**
 * Returns an aleph program message for a given hash
 */
export const getMessage = async (hash: string) => {
  try {
    const msg = await any.GetMessage({
      hash: hash,
    });

    return msg;
  } catch (error) {
    throw E_.RequestFailed(error);
  }
};

/**
 * Get all the products (databases, instances, functions) for a given account
 *
 * @param account
 * @returns An object containing the products
 */
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

  products.functions = [
    ...(query.messages.filter((msg) => msg.content) as ProgramMessage[]),
  ];

  return products;
};

type CreateFunctionParams = {
  account: Account;
  file: File;
  name: string;
  tags: string[];
  entrypoint: string;
  isPersistent: boolean;
  runtime: string;
  encoding: Encoding;
  volumes: Array<MachineVolume | PersistentVolume>;
  computeUnits: number;
  variables: Record<string, string>;
};
export const createFunctionProgram = async ({
  account,
  file,
  name,
  tags,
  entrypoint,
  isPersistent,
  runtime,
  volumes,
  computeUnits,
  variables,
}: CreateFunctionParams) => {
  const { memory, cpu } = getFunctionSpecsByComputeUnits(
    computeUnits,
    isPersistent
  );

  try {
    const msg = await program.publish({
      channel: "ALEPH-CLOUDSOLUTIONS",
      account,
      isPersistent,
      file,
      volumes,
      metadata: {
        name,
        tags,
      },
      runtime,
      entrypoint,
      memory,
      vcpus: cpu,
      variables,
    });

    return msg;
  } catch (err) {
    throw E_.RequestFailed(err);
  }
};

/**
 * Deletes a VM using a forget message
 */
export const deleteVM = async (account: Account, message: ProgramMessage) => {
  try {
    const msg = await forget.Publish({
      account,
      hashes: [message.item_hash],
      channel: message.channel,
    });

    return msg;
  } catch (err) {
    throw E_.RequestFailed(err);
  }
};

// TODO: implement
export const createVolume = async (account: Account, size: number) => {
  try {
    // const msg = await store.Publish({
    //   account,
    //   size,
    // });
    // return msg;
  } catch (err) {
    throw E_.RequestFailed(err);
  }
};
