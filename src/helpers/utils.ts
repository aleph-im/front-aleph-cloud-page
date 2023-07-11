import { BrowserProvider, Contract } from 'ethers'
import E_ from './errors'
import {
  EphemeralVolume,
  InstanceMessage,
  MessageType,
  PersistentVolume,
  PostMessage,
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/types'
import { MachineVolume } from 'aleph-sdk-ts/dist/messages/types'
import { EntityType } from './constants'
import { SSHKey } from '../domain/ssh'
import { Instance } from '../domain/instance'
import { AddVolume, Volume, VolumeManager, VolumeType } from '@/domain/volume'
import { Program } from '@/domain/program'

/**
 * Takes a string and returns a shortened version of it, with the first 6 and last 4 characters separated by '...'
 *
 * @param text A text to be shortened
 * @param start Number of chars to print from the begining
 * @param end Number of chars to print from the end
 * @returns A shortened text
 */
export const ellipseText = (text: string, start = 10, end = 0) => {
  if (text.length <= start) return text
  if (text.length <= end) return text
  return `${text.slice(0, start)}...${end > 0 ? text.slice(-end) : ''}`
}

/**
 * Takes a string and returns a shortened version of it, with the first 6 and last 4 characters separated by '...'
 *
 * @param address An address to be shortened
 * @returns A shortened address
 */
export const ellipseAddress = (address: string) => {
  return ellipseText(address, 6, 4)
}

/**
 * Checks if a string is a valid Aleph message item hash
 */
export const isValidItemHash = (hash: string) => {
  const regex = /^[0-9a-f]{64}$/
  return regex.test(hash)
}

/**
 * Get the Aleph balance for a given Ethereum address
 *
 * @param address An Ethereum address
 * returns The Aleph balance of the address
 */
export const getERC20Balance = async (address: string) => {
  const ethereumProvider = new BrowserProvider(window?.ethereum)

  const ERC20_ABI = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',

    // Authenticated Functions
    'function transfer(address to, uint amount) returns (boolean)',

    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)',
  ]

  const ERC20_CONTRACT_ADDRESS = '0x27702a26126e0B3702af63Ee09aC4d1A084EF628'

  const ERC20Contract = new Contract(
    ERC20_CONTRACT_ADDRESS,
    ERC20_ABI,
    ethereumProvider,
  )

  try {
    const rawBalance = await ERC20Contract.balanceOf(address)
    const decimals = await ERC20Contract.decimals()
    const balance = rawBalance / 10 ** decimals
    return balance
  } catch (error) {
    throw E_.RequestFailed(error)
  }
}

/**
 * Gets the Aleph balance for a given Solana address
 *
 * @param address A Solana address
 * @returns The Aleph balance of the address
 */
export const getSOLBalance = async (address: string) => {
  // FIXME: This is a temporary solution
  try {
    const query = await fetch(
      `https://balance1.api.aleph.cloud/solana/${address}`,
    )

    const { balance } = await query.json()
    return balance
  } catch (error) {
    throw E_.RequestFailed(error)
  }
}

type BitUnit = 'b' | 'kb' | 'mb' | 'gb' | 'tb'
type ConvertBitUnitOptions = {
  from: BitUnit
  to: BitUnit
  displayUnit: boolean
}
const units = {
  b: 1,
  kb: 1000,
  mb: 1000 ** 2,
  gb: 1000 ** 3,
  tb: 1000 ** 4,
}
export const convertBitUnits = (
  value: number,
  {
    from = 'mb',
    to = 'gb',
    displayUnit = true,
  }: Partial<ConvertBitUnitOptions>,
) => {
  const result = (value * units[from]) / units[to]
  return displayUnit ? `${result} ${to.toUpperCase()}` : result
}

/**
 * Converts a number of bytes to a human readable size
 */
export const humanReadableSize = (
  value?: number,
  from: 'b' | 'kb' | 'mb' | 'gb' | 'tb' = 'b',
): string => {
  if (value === undefined) return 'n/a'
  if (value === 0) return '-'

  const units = ['b', 'kb', 'mb', 'gb', 'tb']
  const pow = units.indexOf(from)
  value = value * 1000 ** pow

  let i = -1
  while (value >= 1000 ** (i + 1) && i < units.length) {
    i++
  }

  return `${(value / 1000 ** i).toFixed(2)} ${units[i].toUpperCase()}`
}

/**
 * Transforms a number into a multiple of 1000 with a suffix, (ex: 625217 -> 625.2K)
 */
export const humanReadableCurrency = (value?: number) => {
  if (value === undefined) return 'n/a'
  if (value < 1_000) return value.toFixed(1)
  else if (value < 10 ** 6) return (value / 1_000).toFixed(1) + 'K'
  else if (value < 10 ** 9) return (value / 10 ** 6).toFixed(1) + 'M'
  else return (value / 10 ** 9).toFixed(1) + 'B'
}

/**
 * Returns a link to the Aleph explorer for a given message
 */
export const getExplorerURL = ({
  item_hash,
  chain,
  sender,
  type,
}: ProgramMessage | StoreMessage) =>
  `https://explorer.aleph.im/address/${chain}/${sender}/message/${type}/${item_hash}`

export const getDate = (time: number): string => {
  const [date, hour] = new Date(time * 1000).toISOString().split('T')
  const [hours] = hour.split('.')

  return `${date} ${hours}`
}

/**
 * Converts a UNIX timestamp to an ISO date, or returns a default value if the timestamp is invalid
 *
 * @param timeStamp A UNIX timestamp
 * @param noDate A default value to return if the timestamp is invalid
 */
export const unixToISODateString = (timeStamp?: number, noDate = 'n/a') => {
  if (!timeStamp) return noDate
  const date = new Date(timeStamp * 1000)
  return date.toISOString().split('T')[0]
}

/**
 * Dirty hack (using a hidden link) to download a blob
 */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

/**
 * Converts a UNIX timestamp to an ISO date and time, or returns a default value if the timestamp is invalid
 *
 * @param timeStamp A UNIX timestamp
 * @param noDate A default value to return if the timestamp is invalid
 */
export const unixToISODateTimeString = (timeStamp?: number, noDate = 'n/a') => {
  if (!timeStamp) return noDate
  const date = new Date(timeStamp * 1000)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZoneName: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date)
}

type CapabilitiesConfig = {
  internetAccess?: boolean
  blockchainRPC?: boolean
  enableSnapshots?: boolean
}

export type FunctionPriceConfig = {
  cpu?: number
  isPersistentVM: boolean
  capabilities?: CapabilitiesConfig
}

export type FunctionCost = {
  compute: number
  capabilities: number
  storageAllowance: number
}

/**
 * Calculates the amount of tokens required to deploy a function
 */
export const getFunctionCost = ({
  isPersistentVM,
  cpu = 0,
  capabilities = {},
}: FunctionPriceConfig): FunctionCost => {
  if (!cpu) {
    return {
      compute: 0,
      capabilities: 0,
      storageAllowance: 0,
    }
  }

  const basePrice = isPersistentVM ? 2_000 : 200
  const storageAllowance = 2 * 10 ** Number(isPersistentVM) * cpu

  return {
    compute: basePrice * cpu,
    capabilities: Object.values(capabilities).reduce(
      (ac, cv) => ac + Number(cv),
      1,
    ),
    storageAllowance,
  }
}

export type VolumesPriceConfig = {
  volumes?: (Volume | AddVolume)[]
}

export type GetTotalProductCostConfig = FunctionPriceConfig & VolumesPriceConfig
export type GetTotalProductReturn = {
  computeTotalCost: number
  perVolumeCost: number[]
  volumeTotalCost: number
  totalCost: number
}

export const getTotalProductCost = ({
  cpu,
  isPersistentVM,
  volumes,
  capabilities,
}: GetTotalProductCostConfig): GetTotalProductReturn => {
  const newVolumes =
    volumes?.filter((volume) => volume.volumeType !== VolumeType.Existing) || []

  const { compute: computeTotalCost, storageAllowance } = getFunctionCost({
    cpu,
    isPersistentVM,
    capabilities,
  })

  // @note: If no compute units are provided (compute = 0, storageAllowance= 0),
  // we only calculate the cost of the volumes
  // This will most likely be called from the create volume page
  const perVolumeCost = VolumeManager.getPerVolumeCost(
    newVolumes,
    storageAllowance,
  )
  const volumeTotalCost = perVolumeCost.reduce((ac, cv) => ac + cv, 0)
  const totalCost = volumeTotalCost + computeTotalCost

  return {
    computeTotalCost,
    perVolumeCost,
    volumeTotalCost,
    totalCost,
  }
}

export type AnyProduct = Program | Instance | Volume | SSHKey

export type AnyMessage =
  | ProgramMessage
  | InstanceMessage
  | StoreMessage
  | PostMessage<SSHKey>

export const isVolume = (msg: AnyMessage) => msg.type === MessageType.store
export const isProgram = (msg: AnyMessage) => msg.type === MessageType.program
export const isInstance = (msg: AnyMessage) => msg.type === MessageType.instance
export const isSSHKey = (msg: AnyMessage) => msg.type === MessageType.post

export function getEntityTypeFromMessage(msg: AnyMessage): EntityType {
  if (isVolume(msg)) return EntityType.Volume
  if (isProgram(msg)) return EntityType.Program
  if (isInstance(msg)) return EntityType.Instance
  if (isSSHKey(msg)) return EntityType.SSHKey
  throw new Error('Unknown type')
}

export function isVolumePersistent(
  volume: MachineVolume,
): volume is PersistentVolume {
  return volume.hasOwnProperty('persistence')
}

export function isVolumeEphemeral(
  volume: MachineVolume,
): volume is EphemeralVolume {
  return volume.hasOwnProperty('ephemeral')
}

/**
 * An util to create promises and control their lifecycle from other scope.
 * In other frameworks they usually call it "Deferred" too.
 *
 * Example:
 * ```ts
 * function sleep(ms) {
 *   const future = new Future()
 *   setTimeout(() => future.resolve(), ms)
 *   return future.promise
 * }
 *
 * async function main() {
 *   await sleep(1000)
 * }
 * ```
 */
export class Future<T> {
  public resolve!: (value: T | PromiseLike<T>) => void
  public reject!: (reason?: any) => void
  public promise!: Promise<T>

  constructor() {
    this.promise = new Promise<T>((_res, _rej) => {
      this.resolve = _res
      this.reject = _rej
    })
  }
}

/**
 * An util for controlling concurrency (lock / unlock) forcing sequential access
 * to some region of the code
 *
 * Example:
 * ```ts
 * // Waits for the lock to be free and returns the releaser function
 * const release = await mutex.acquire()
 *
 * try {
 *   // Execute the concurrent safe code here
 * } finally {
 *   // Release the lock.
 *   // Ensures that the lock is always released, even if there are errors
 *   release()
 * }
 * ```
 */
export class Mutex {
  protected queue = Promise.resolve()
  public count = 0

  async acquire(): Promise<() => void> {
    const release = new Future<void>()

    const currentQueue = this.queue
    this.queue = this.queue.then(() => release.promise)
    this.count++

    await currentQueue

    return () => {
      this.count--
      release.resolve()
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
