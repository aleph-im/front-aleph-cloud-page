import {
  Message,
  EphemeralVolume,
  InstanceMessage,
  MessageType,
  PersistentVolume,
  PostMessage,
  ProgramMessage,
  StoreMessage,
} from '@aleph-sdk/message'
import { MachineVolume } from '@aleph-sdk/message'
import { EntityType, apiServer } from './constants'
import { SSHKey } from '../domain/ssh'
import { Instance } from '../domain/instance'
import { Volume } from '@/domain/volume'
import { Program } from '@/domain/program'
import { Domain } from '@/domain/domain'
import { Website } from '@/domain/website'
import { CID } from 'multiformats'
import Err from './errors'

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
 * Get the Aleph balance for a given Ethereum address
 *
 * @param address An Ethereum address
 * returns The Aleph balance of the address
 */
export const getERC20Balance = async (address: string) => {
  try {
    const query = await fetch(
      `${apiServer}/api/v0/addresses/${address}/balance`,
    )

    // @note: 404 means the balance is 0, don't throw error in that case
    if (query.status === 404) return 0

    const { balance } = await query.json()
    return balance
  } catch (error) {
    throw Err.RequestFailed(error)
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
    throw Err.RequestFailed(error)
  }
}

export function round(num: number, decimals = 2) {
  const pow = 10 ** decimals
  return Math.round((num + Number.EPSILON) * pow) / pow
}

export type ByteUnit =
  | 'B'
  | 'kB'
  | 'MB'
  | 'GB'
  | 'TB'
  | 'KiB'
  | 'MiB'
  | 'GiB'
  | 'TiB'

export type ConvertBitUnitOptions<D extends boolean> = {
  from: ByteUnit
  to: ByteUnit
  displayUnit?: D
}
type R<D> = D extends true ? string : number

export const byteUnits: Record<ByteUnit, number> = {
  // byte
  B: 1,
  // kilo
  kB: 10 ** 3,
  MB: 10 ** 6,
  GB: 10 ** 9,
  TB: 10 ** 12,
  // kibi
  KiB: 2 ** 10,
  MiB: 2 ** 20,
  GiB: 2 ** 30,
  TiB: 2 ** 40,
}

export const byteUnitSubfix: Record<ByteUnit, ByteUnit> = {
  B: 'B',
  kB: 'kB',
  MB: 'MB',
  GB: 'GB',
  TB: 'TB',
  // @note: It is wrong and confusing, I know....
  KiB: 'kB',
  MiB: 'MB',
  GiB: 'GB',
  TiB: 'TB',
}

export function convertByteUnits<D extends boolean = false>(
  value: number,
  {
    from = 'MiB',
    to = 'GiB',
    displayUnit = false as D,
  }: ConvertBitUnitOptions<D>,
): R<D> {
  const result = (value * byteUnits[from]) / byteUnits[to]

  return (
    displayUnit ? `${result.toFixed(2)} ${byteUnitSubfix[to]}` : result
  ) as R<D>
}

function getHumanReadableUnit(
  value: number,
  units: ByteUnit[] = ['B', 'KiB', 'MiB', 'GiB', 'TiB'],
): ByteUnit {
  let optimalUnit: ByteUnit = 'B'

  for (const unit of units) {
    if (value < byteUnits[unit]) break
    optimalUnit = unit
  }

  return optimalUnit
}

/**
 * Converts a number of bytes to a human readable size
 */
export function humanReadableSize(
  value?: number,
  from: ByteUnit = 'B',
): string {
  if (value === Number.POSITIVE_INFINITY) return 'n/a'
  if (value === undefined) return 'n/a'
  if (value === 0) return '-'

  const bits = convertByteUnits(value, { from, to: 'B' })
  const to = getHumanReadableUnit(bits)
  return convertByteUnits(value, { from, to, displayUnit: true })
}

/**
 * Transforms a number into a multiple of 1000 with a suffix, (ex: 625217 -> 625.2K)
 */
export const humanReadableCurrency = (value?: number, decimals = 2) => {
  if (value === Number.POSITIVE_INFINITY) return 'n/a'
  if (value === undefined) return 'n/a'
  if (value === 0) return value
  if (value < 1_000) return value.toFixed(decimals)
  else if (value < 10 ** 6) return (value / 1_000).toFixed(decimals) + 'K'
  else if (value < 10 ** 9) return (value / 10 ** 6).toFixed(decimals) + 'M'
  else return (value / 10 ** 9).toFixed(decimals) + 'B'
}

const messageTypeWhitelist = new Set(Object.values(MessageType))

/**
 * Returns a link to the Aleph explorer for a given message
 */
export const getExplorerURL = ({ item_hash, chain, sender, type }: Message) => {
  type = messageTypeWhitelist.has(type as MessageType) ? type : MessageType.post
  return `https://explorer.aleph.im/address/${chain}/${sender}/message/${type}/${item_hash}`
}

export const getDate = (time: number | string): string => {
  const dateTime =
    typeof time === 'string' ? time : new Date(time * 1000).toISOString()
  const [date, hour] = dateTime.split('T')
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

export const cidV0Tov1 = function (cid: string): string {
  return CID.parse(cid).toV1().toString()!
}

export type AnyEntity = Program | Instance | Volume | SSHKey | Domain | Website

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
  throw Err.UnknownType
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

export function toKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\\-]/g, '')
    .replace(/_/g, '-')
}

export function toSnakeCase(input: string): string {
  return toKebabCase(input).replace(/-/g, '_')
}

export function toPascalCase(input: string): string {
  return input[0].toUpperCase() + input.slice(1).toLowerCase()
}

// -------------------------- @todo: Refactor in domain package -------------------

/**
 * Fetches a URL and caches the result in LocalStorage for a given time
 *
 * @param {string} url The URL to fetch
 * @param {string} cacheKey The LocalStorage key to use for cachinng (must be unique)
 * @param {number} cacheTime The time in ms to cache the data
 * @returns
 */
export async function fetchAndCache<T = unknown, P = unknown>(
  url: string,
  cacheKey: string,
  cacheTime: number,
  parse?: (data: T) => P | Promise<P>,
  log = false,
): Promise<P> {
  const cached = localStorage.getItem(cacheKey)
  const now = Date.now()

  if (cached) {
    const { cachedAt, value } = JSON.parse(cached)
    if (now - cachedAt < cacheTime) {
      log && console.log(`Retrieved ${cacheKey} from cache`)
      return value
    }
  }

  try {
    const data = await fetch(url)
    let value = await data.json()

    if (parse) {
      value = await parse(value)
    }

    const toCache = JSON.stringify({
      cachedAt: now,
      value,
    })

    localStorage.setItem(cacheKey, toCache)

    return value
  } catch (error) {
    log && console.error(`Failed to fetch ${url}`, error)
    if (cached) return JSON.parse(cached).value
    throw error
  }
}

/**
 * Takes a list of github releases and returns the latest, the latest prerelease and a list of outdated versions
 *
 * @param {Array} payload A list of github releases, returned from the API (https://api.github.com/repos/[owner]/[name]/releases)
 * @param {Number} outdatedAfter The time in ms after which a release is considered outdated (defaults to 14 days)
 */
export function getLatestReleases(
  payload: any,
  outdatedAfter = 1000 * 60 * 60 * 24 * 14,
) {
  const versions = {
    latest: null,
    prerelease: null,
    outdated: null,
  }

  let latestReleaseDate = 0
  if (!payload) return versions

  for (const item of payload) {
    if (item.prerelease && !versions.prerelease) {
      versions.prerelease = item.tag_name
    }
    if (!item.prerelease && !versions.latest) {
      versions.latest = item.tag_name
      latestReleaseDate = new Date(item.published_at).getTime()
    }
    if (
      versions.latest &&
      versions.prerelease &&
      !versions.outdated &&
      !item.prerelease &&
      Date.now() - latestReleaseDate < outdatedAfter
    ) {
      versions.outdated = item.tag_name
    }
  }

  return versions
}

export const humanReadableDurationUnit = (
  streamDuration?: {
    duration: number
    unit: 'h' | 'd' | 'm' | 'y'
  },
  plural = true,
) => {
  if (!streamDuration) return ''

  const { duration, unit } = streamDuration || {}
  if (!unit || !duration) return ''

  const s = duration === 1 ? '' : plural ? 's' : ''

  const subfix =
    unit === 'h'
      ? `hour${s}`
      : unit === 'd'
        ? `day${s}`
        : unit === 'm'
          ? `month${s}`
          : `year${s}`

  return `${duration} ${subfix}`
}

export function getVersionNumber(version: string): number {
  if (!version) return 0

  try {
    const parts = version
      .replace(/[a-zA-Z-]/g, '')
      .split('.')
      .map(Number)

    return parts.reduce((ac, cv) => ac * 1000 + cv, 0)
  } catch (e) {
    return 0
  }
}
