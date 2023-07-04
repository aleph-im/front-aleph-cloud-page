import { BrowserProvider, Contract } from 'ethers'
import E_ from './errors'
import {
  InstanceMessage,
  MessageType,
  PostMessage,
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/types'
import { MachineVolume } from 'aleph-sdk-ts/dist/messages/types'
import { EntityType } from './constants'
import { EnvVar } from '@/hooks/form/useAddEnvVars'
import { SSHKey } from './ssh'
import { Instance } from './instance'
import { Volume, VolumeType } from '@/hooks/form/useAddVolume'

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
 * Takes a collection of environment variables and returns an object with the name and value of each variable.
 */
export const parseEnvVars = (
  envVars?: EnvVar[],
): Record<string, string> | undefined => {
  if (!envVars) return

  return envVars.reduce((acc, env) => {
    const name = env.name.trim()
    const value = env.value.trim()

    if (name.length <= 0) throw new Error(`Invalid env var name "${name}"`)
    if (value.length <= 0) throw new Error(`Invalid env var value "${value}"`)

    acc[name] = value

    return acc
  }, {} as Record<string, string>)
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
export const humanReadableSize = (value?: number) => {
  if (value === undefined) return 'n/a'
  if (value === 0) return '-'

  const units = ['b', 'kb', 'mb', 'gb', 'tb']
  let i = 0
  while (value > 1000 ** i && i < units.length) {
    i++
  }

  return (value / 1000 ** (i - 1)).toFixed(2) + units[i]
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

/**
 * Returns the size of a volume in mb
 */
export function getVolumeSize(volume: Volume): number {
  if (volume.type === VolumeType.New) {
    return volume.size || (volume?.fileSrc?.size || 0) / 10 ** 6
  }

  return volume.size || 0
}

export function getVolumeCost(volume: Volume): number {
  return getVolumeSize(volume) * 20
}

// @note: The algorithm for calculating the cost per volume is as follows:
// 1. Calculate the storage allowance for the function, the more compute units, the more storage allowance
// 2. For each volume, subtract the storage allowance from the volume size
// 3. If there is more storage than allowance left, the additional storage is charged at 20 tokens per mb
export function getPerVolumeCost(
  volumes: Volume[],
  storageAllowance = 0,
): number[] {
  return volumes.map((volume) => {
    let size = getVolumeSize(volume) || 0

    if (storageAllowance > 0) {
      if (size <= storageAllowance) {
        storageAllowance -= size
        size = 0
      } else {
        size -= storageAllowance
        storageAllowance = 0
      }
    }

    return size * 20
  })
}

export function getVolumeTotalCost(
  volumes: Volume[],
  storageAllowance = 0,
): number {
  return getPerVolumeCost(volumes, storageAllowance).reduce(
    (ac, cv) => ac + cv,
    0,
  )
}

export type VolumesPriceConfig = {
  volumes?: Volume[]
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
    volumes?.filter((volume) => volume.type !== VolumeType.Existing) || []

  const { compute: computeTotalCost, storageAllowance } = getFunctionCost({
    cpu,
    isPersistentVM,
    capabilities,
  })

  // @note: If no compute units are provided (compute = 0, storageAllowance= 0),
  // we only calculate the cost of the volumes
  // This will most likely be called from the create volume page
  const perVolumeCost = getPerVolumeCost(newVolumes, storageAllowance)
  const volumeTotalCost = perVolumeCost.reduce((ac, cv) => ac + cv, 0)
  const totalCost = volumeTotalCost + computeTotalCost

  return {
    computeTotalCost,
    perVolumeCost,
    volumeTotalCost,
    totalCost,
  }
}

export type AnyProduct = ProgramMessage | Instance | StoreMessage | SSHKey

export type AnyMessage =
  | ProgramMessage
  | InstanceMessage
  | StoreMessage
  | PostMessage<SSHKey>

export const isVolume = (msg: AnyMessage) => msg.type === MessageType.store
export const isProgram = (msg: AnyMessage) => msg.type === MessageType.program
export const isInstance = (msg: AnyMessage) => msg.type === MessageType.instance
export const isSSHKey = (msg: AnyMessage) => msg.type === MessageType.post

export const getEntityTypeFromMessage = (
  msg: ProgramMessage | StoreMessage,
) => {
  if (isVolume(msg)) return EntityType.Volume
  if (isProgram(msg)) return EntityType.Program
  if (isInstance(msg)) return EntityType.Instance
  if (isSSHKey(msg)) return EntityType.SSHKey
}

export const isVolumePersistent = (volume: MachineVolume) => {
  return volume.hasOwnProperty('persistence')
}
