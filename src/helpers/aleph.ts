import {
  Chain,
  MessageType,
  ProgramMessage,
  StoreMessage,
  MachineVolume,
  PersistentVolume,
} from 'aleph-sdk-ts/dist/messages/types'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { any, program, forget, store } from 'aleph-sdk-ts/dist/messages'
import { GetAccountFromProvider as getETHAccount } from 'aleph-sdk-ts/dist/accounts/ethereum'
import { GetAccountFromProvider as getSOLAccount } from 'aleph-sdk-ts/dist/accounts/solana'
import { getERC20Balance, getSOLBalance } from './utils'
import E_ from './errors'
import { Encoding } from 'aleph-sdk-ts/dist/messages/program/programModel'
import { defaultVMChannel, defaultVolumeChannel } from './constants'

/**
 * Connects to a web3 provider and returns an Aleph account object
 *
 * @param chain The chain to connect to
 * @param provider A web3 provider (ex: window.ethereum)
 */
export const web3Connect = (chain: Chain, provider: any): Promise<Account> => {
  switch (chain) {
    case Chain.ETH:
      return getETHAccount(provider)

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

    case Chain.SOL:
      return getSOLBalance(account.address)

    default:
      throw E_.ChainNotYetSupported
  }
}

/**
 * Returns an aleph program message for a given hash
 */
export const getMessage = async (hash: string) => {
  try {
    const msg = await any.GetMessage({
      hash: hash,
    })

    return msg
  } catch (error) {
    throw E_.RequestFailed(error)
  }
}

/**
 * Get all the products (databases, instances, functions, volumes) for a given account
 *
 * @param account
 * @returns An object containing the products
 */
export const getAccountProducts = async (account: Account) => {
  const [functions, volumes] = await Promise.all([
    getAccountFunctions(account),
    getAccountVolumes(account),
  ])

  return {
    functions,
    volumes,
  }
}

// @todo: Refactor
export const getAccountFunctions = async (
  account: Account,
): Promise<ProgramMessage[]> => {
  const response = await any.GetMessages({
    addresses: [account.address],
    messageType: MessageType.program,
    channels: [defaultVMChannel],
  })

  return response.messages.filter(
    (x) => x.content != undefined,
  ) as ProgramMessage[]
}

// @todo: Refactor
export const getAccountVolumes = async (
  account: Account,
): Promise<StoreMessage[]> => {
  const response = await any.GetMessages({
    addresses: [account.address],
    messageType: MessageType.store,
    channels: [defaultVolumeChannel],
  })

  return response.messages.filter(
    (x) => x.content != undefined,
  ) as StoreMessage[]
}

type CreateFunctionParams = {
  account: Account
  file: File
  name: string
  tags: string[]
  entrypoint: string
  isPersistent: boolean
  runtime: string
  encoding?: Encoding
  volumes: (MachineVolume | PersistentVolume)[]
  memory: number
  vcpus: number
  variables: Record<string, string>
}
export const createFunctionProgram = async ({
  account,
  file,
  name,
  tags,
  entrypoint,
  isPersistent,
  runtime,
  volumes,
  memory,
  vcpus,
  variables,
}: CreateFunctionParams) => {
  try {
    const msg = await program.publish({
      channel: defaultVMChannel,
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
      vcpus,
      variables,
    })

    return msg
  } catch (err) {
    throw E_.RequestFailed(err)
  }
}

/**
 * Deletes a VM using a forget message
 */
export const deleteVM = async (
  account: Account,
  message: ProgramMessage | StoreMessage,
) => {
  try {
    const msg = await forget.Publish({
      account,
      hashes: [message.item_hash],
      channel: message.channel,
    })

    return msg
  } catch (err) {
    throw E_.RequestFailed(err)
  }
}

/**
 * Creates an immutable volume using a store message
 *
 * @param account An aleph account object
 * @param file A squashfs or ext4 volume file
 * @returns The store message promise
 */
export const createVolume = async (
  account: Account,
  file: File,
): Promise<StoreMessage> => {
  return store.Publish({
    account,
    fileObject: file,
    channel: defaultVolumeChannel,
  })
}

/**
 * Returns all the volumes for a given account
 *
 * @param account An aleph account object
 */
export const getVolumes = async (account: Account) => {
  try {
    const query = await any.GetMessages({
      addresses: [account.address],
      messageType: MessageType.store,
      channels: [defaultVolumeChannel],
    })

    return query.messages
  } catch (error) {
    throw E_.RequestFailed(error)
  }
}

export type AccountFileObject = {
  file_hash: string
  size: number
  type: 'file'
  created: string
  item_hash: string
}
export type AccountFilesResponse = {
  address: string
  total_size: number
  files: AccountFileObject[]
}

/**
 * Fetches all the files pinned by the user (fails silently)
 *
 * @param account An aleph account object
 * @returns
 */
export const getAccountFileStats = async (account: Account) => {
  const emptyPayload = {
    address: account.address,
    total_size: 0,
    files: [],
  }

  try {
    const q = await fetch(
      `https://api2.aleph.im/api/v0/addresses/${account.address}/files`,
    )
    const r: AccountFilesResponse = await q.json()
    return r || emptyPayload
  } catch (e) {
    console.error(e)
    return emptyPayload
  }
}
