import { providers, Contract } from 'ethers'
import E_ from './errors'
import {
  MessageType,
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import {
  ImmutableVolume,
  MachineVolume,
  PersistentVolume,
} from 'aleph-sdk-ts/dist/messages/program/programModel'

/**
 * Takes a string and returns a shortened version of it, with the first 6 and last 4 characters separated by '...'
 *
 * @param address An address to be shortened
 * @returns A shortened address
 */
export const ellipseAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Checks if a string is a valid Aleph message item hash
 */
export const isValidItemHash = (hash: string) => {
  const regex = /^[0-9a-f]{64}$/
  return regex.test(hash)
}

export type EnvironmentVariable = {
  name: string
  value: string
}
/**
 * Takes a collection of environment variables and returns an object with the name and value of each variable.
 */
export const safeCollectionToObject = (collection: EnvironmentVariable[]) => {
  const ret: Record<string, string> = {}
  for (const { name, value } of collection) {
    if (name.trim().length > 0 && value.trim().length > 0) {
      ret[name] = value
    }
  }

  return ret
}

/**
 * Get the Aleph balance for a given Ethereum address
 *
 * @param address An Ethereum address
 * returns The Aleph balance of the address
 */
export const getERC20Balance = async (address: string) => {
  // FIXME: This is a temporary solution, we should not rely on Infura
  const provider = new providers.InfuraProvider(
    'homestead',
    '4890a5bd89854916b128088119d76b50',
  )

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
    provider,
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
export const convertBitUnits = (
  value: number,
  {
    from = 'mb',
    to = 'gb',
    displayUnit = true,
  }: Partial<ConvertBitUnitOptions>,
) => {
  const options: ConvertBitUnitOptions = { from, to, displayUnit }
  const units = {
    b: 1,
    kb: 1000,
    mb: 1000 ** 2,
    gb: 1000 ** 3,
    tb: 1000 ** 4,
  }

  const result = (value * units[options.from]) / units[options.to]
  return options.displayUnit ? `${result} ${options.to.toUpperCase()}` : result
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

export const getStoreMessageSize = async (message: StoreMessage) => {
  const headReq = await fetch(
    'https://ipfs.io/ipfs/' + message.content.item_hash,
    {
      method: 'HEAD',
    },
  )

  try {
    const size = headReq.headers.get('content-length')
    return Number(size)
  } catch (err) {
    return 0
  }
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

type MachineSpecs = {
  cpu: number
  memory: number
  storage: number
}
export const getFunctionSpecsByComputeUnits = (
  computeUnits: number,
  isPersistent: boolean,
): MachineSpecs => {
  return {
    cpu: 1 * computeUnits,
    memory: 2 * computeUnits * 1000,
    storage: 2 * 10 ** Number(isPersistent) * computeUnits,
  }
}

type CapabilitiesConfig = {
  internetAccess?: boolean
  blockchainRPC?: boolean
  enableSnapshots?: boolean
}

export type FunctionPriceConfig = {
  computeUnits: number
  storage: number
  isPersistent: boolean
  capabilities: CapabilitiesConfig
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
  computeUnits,
  storage,
  isPersistent,
  capabilities,
}: FunctionPriceConfig): FunctionCost => {
  const extraStorageCost = 0
  const storageAllowance = getFunctionSpecsByComputeUnits(
    computeUnits,
    isPersistent,
  ).storage
  const basePrice = isPersistent ? 2_000 : 200

  return {
    compute: basePrice * computeUnits,
    capabilities: Object.values(capabilities).reduce(
      (ac, cv) => (ac += cv ? 1 : 0),
      1,
    ),
    storageAllowance,
  }
}

/**
 * Returns true if the provided aleph message is a volume message
 */
export const isVolume = (msg: ProgramMessage | StoreMessage) =>
  msg.type === MessageType.store

/**
 * Returns true if the provided aleph message is a program message
 */
export const isProgram = (msg: ProgramMessage | StoreMessage) =>
  msg.type === MessageType.program

export const isVolumePersistent = (volume: MachineVolume) => {
  return volume.hasOwnProperty('persistence')
}
