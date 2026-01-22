import { ForwardedPort, NewForwardedPortEntry } from './types'
import { PortProtocol } from '@/domain/forwardedPorts'

export const SYSTEM_PORTS: ForwardedPort[] = [
  {
    source: '22',
    destination: undefined,
    tcp: true,
    udp: true,
    isDeletable: false, // System ports cannot be deleted
  },
]

export const MAX_PORTS_ALLOWED = 20
export const POLLING_INTERVAL = 5000
export const NOTIFICATION_DELAY = 5000

export function getSystemPorts(): ForwardedPort[] {
  return [...SYSTEM_PORTS]
}

export function isSystemPort(portSource: string): boolean {
  return SYSTEM_PORTS.some(
    (port) => port.source === portSource && !port.isDeletable,
  )
}

export function filterOutSystemPorts(
  ports: NewForwardedPortEntry[],
): NewForwardedPortEntry[] {
  return ports.filter((port) => !isSystemPort(port.port))
}

export function transformPortsToAPIFormat(
  ports: NewForwardedPortEntry[],
): Record<number, PortProtocol> {
  const newPortsMap: Record<number, PortProtocol> = {}
  ports.forEach((port) => {
    const portNumber = parseInt(port.port, 10)
    newPortsMap[portNumber] = {
      tcp: port.tcp,
      udp: port.udp,
    }
  })
  return newPortsMap
}

export function transformAPIPortsToUI(
  ports: Record<number, PortProtocol>,
): ForwardedPort[] {
  return Object.entries(ports).map(([port, protocol]) => ({
    source: port,
    destination: undefined,
    tcp: protocol.tcp,
    udp: protocol.udp,
    isDeletable: true,
  }))
}

export function mergePortsWithMappings(
  ports: ForwardedPort[],
  mappings:
    | Record<string, { host: number; tcp: boolean; udp: boolean }>
    | undefined,
): ForwardedPort[] {
  if (!mappings) return ports

  return ports.map((port) => {
    const mappedPort = mappings[port.source]
    return {
      ...port,
      destination: mappedPort?.host.toString(),
    }
  })
}

export function validatePortEntry(port: {
  port: string
  tcp: boolean
  udp: boolean
}): { isValid: boolean; error?: string } {
  const portNumber = parseInt(port.port, 10)

  // Check port range
  if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
    return { isValid: false, error: 'Port must be between 1 and 65535' }
  }

  // Check at least one protocol is selected
  if (!port.tcp && !port.udp) {
    return {
      isValid: false,
      error: 'At least one protocol (TCP or UDP) must be selected',
    }
  }

  // Check system port
  if (isSystemPort(port.port)) {
    return {
      isValid: false,
      error: `Port ${port.port} is a reserved system port`,
    }
  }

  return { isValid: true }
}

export function validatePortBatch(
  ports: { port: string; tcp: boolean; udp: boolean }[],
  existingPortsCount = 0,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  ports.forEach((port) => {
    const validation = validatePortEntry(port)
    if (!validation.isValid && validation.error) {
      errors.push(`Port ${port.port}: ${validation.error}`)
    }
  })

  // Check for duplicates within the batch
  const portNumbers = ports.map((p) => p.port)
  const duplicates = portNumbers.filter(
    (port, index) => portNumbers.indexOf(port) !== index,
  )
  if (duplicates.length > 0) {
    errors.push(`Duplicate ports in batch: ${duplicates.join(', ')}`)
  }

  // Check if adding these ports would exceed the maximum limit
  const totalPortsAfterAdd = existingPortsCount + ports.length
  if (totalPortsAfterAdd > MAX_PORTS_ALLOWED) {
    errors.push(
      `Maximum ${MAX_PORTS_ALLOWED} ports allowed. Adding ${ports.length} port(s) would result in ${totalPortsAfterAdd} total ports`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function hasUnmappedPorts(ports: ForwardedPort[]): boolean {
  return ports.some((port) => !port.destination)
}

// Browser cache utilities for pending ports
const PENDING_PORTS_CACHE_KEY = 'aleph_pending_forwarded_ports'
const PENDING_REMOVALS_CACHE_KEY = 'aleph_pending_port_removals'
const CACHE_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes

// Helper function to create account-scoped cache keys
function createCacheKey(entityHash: string, accountAddress: string): string {
  return `${entityHash}:${accountAddress}`
}

// Generic cache entry types
type CacheEntry<T> = {
  data: T
  timestamp: number
}

type Cache<T> = Record<string, CacheEntry<T>>

// Specific cache data types
export type PendingPortsData = Record<number, PortProtocol>
export type PendingRemovalsData = number[]

// Generic cache management
function getCache<T>(cacheKey: string): Cache<T> {
  try {
    const cached = localStorage.getItem(cacheKey)
    if (!cached) return {}

    const cache: Cache<T> = JSON.parse(cached)
    const now = Date.now()

    // Clean expired entries
    const validCache: Cache<T> = {}
    Object.entries(cache).forEach(([key, entry]) => {
      if (now - entry.timestamp < CACHE_EXPIRY_MS) {
        validCache[key] = entry
      }
    })

    // Update cache if any entries were cleaned
    if (Object.keys(validCache).length !== Object.keys(cache).length) {
      localStorage.setItem(cacheKey, JSON.stringify(validCache))
    }

    return validCache
  } catch (error) {
    console.warn(`Failed to read cache ${cacheKey}:`, error)
    return {}
  }
}

function setCache<T>(cacheKey: string, cache: Cache<T>): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cache))
  } catch (error) {
    console.warn(`Failed to write cache ${cacheKey}:`, error)
  }
}

function updateCacheEntry<T>(
  cacheKey: string,
  entityKey: string,
  data: T | null,
): void {
  const cache = getCache<T>(cacheKey)

  if (data === null) {
    delete cache[entityKey]
  } else {
    cache[entityKey] = {
      data,
      timestamp: Date.now(),
    }
  }

  setCache(cacheKey, cache)
}

function getCacheEntry<T>(cacheKey: string, entityKey: string): T | null {
  const cache = getCache<T>(cacheKey)
  return cache[entityKey]?.data || null
}

export function addPendingPorts(
  entityHash: string,
  accountAddress: string,
  newPorts: Record<number, PortProtocol>,
): void {
  const entityKey = createCacheKey(entityHash, accountAddress)

  // Check if any of the new ports are in pending removals and remove them
  const pendingRemovals = getCacheEntry<PendingRemovalsData>(
    PENDING_REMOVALS_CACHE_KEY,
    entityKey,
  )
  if (pendingRemovals) {
    const newPortNumbers = Object.keys(newPorts).map(Number)
    const updatedRemovedPorts = pendingRemovals.filter(
      (portNumber) => !newPortNumbers.includes(portNumber),
    )

    updateCacheEntry(
      PENDING_REMOVALS_CACHE_KEY,
      entityKey,
      updatedRemovedPorts.length > 0 ? updatedRemovedPorts : null,
    )
  }

  // Add or merge ports
  const existingPorts = getCacheEntry<PendingPortsData>(
    PENDING_PORTS_CACHE_KEY,
    entityKey,
  )
  const mergedPorts = existingPorts
    ? { ...existingPorts, ...newPorts }
    : newPorts

  updateCacheEntry(PENDING_PORTS_CACHE_KEY, entityKey, mergedPorts)
}

export function removePendingPorts(
  entityHash: string,
  accountAddress: string,
  portNumbers: number[],
): void {
  const entityKey = createCacheKey(entityHash, accountAddress)
  const existingPorts = getCacheEntry<PendingPortsData>(
    PENDING_PORTS_CACHE_KEY,
    entityKey,
  )

  if (!existingPorts) return

  const updatedPorts = { ...existingPorts }
  portNumbers.forEach((portNumber) => {
    delete updatedPorts[portNumber]
  })

  updateCacheEntry(
    PENDING_PORTS_CACHE_KEY,
    entityKey,
    Object.keys(updatedPorts).length > 0 ? updatedPorts : null,
  )
}

export function clearPendingPorts(
  entityHash: string,
  accountAddress: string,
): void {
  const entityKey = createCacheKey(entityHash, accountAddress)
  updateCacheEntry(PENDING_PORTS_CACHE_KEY, entityKey, null)
}

export function getPendingPortsForEntity(
  entityHash: string,
  accountAddress: string,
): Record<number, PortProtocol> {
  const entityKey = createCacheKey(entityHash, accountAddress)
  return (
    getCacheEntry<PendingPortsData>(PENDING_PORTS_CACHE_KEY, entityKey) || {}
  )
}

export function mergePendingPortsWithAggregate(
  entityHash: string,
  accountAddress: string,
  aggregatePorts: Record<number, PortProtocol>,
): Record<number, PortProtocol> {
  const pendingPorts = getPendingPortsForEntity(entityHash, accountAddress)
  return { ...aggregatePorts, ...pendingPorts }
}

// Note: Cleanup is handled automatically by cache expiry (30 minutes)
// This approach prevents issues with stale aggregate data

// Pending port removals management

export function getPendingRemovalsForEntity(
  entityHash: string,
  accountAddress: string,
): number[] {
  const entityKey = createCacheKey(entityHash, accountAddress)
  return (
    getCacheEntry<PendingRemovalsData>(PENDING_REMOVALS_CACHE_KEY, entityKey) ||
    []
  )
}

export function addPendingPortRemoval(
  entityHash: string,
  accountAddress: string,
  portNumber: number,
): void {
  const entityKey = createCacheKey(entityHash, accountAddress)
  const existingRemovals = getCacheEntry<PendingRemovalsData>(
    PENDING_REMOVALS_CACHE_KEY,
    entityKey,
  )

  const updatedRemovals = existingRemovals
    ? [...existingRemovals, portNumber]
    : [portNumber]

  updateCacheEntry(PENDING_REMOVALS_CACHE_KEY, entityKey, updatedRemovals)
}

// Note: Removal cleanup is handled automatically by cache expiry (30 minutes)
// This prevents issues with stale aggregate data

export function applyPendingRemovals(
  entityHash: string,
  accountAddress: string,
  ports: Record<number, PortProtocol>,
): Record<number, PortProtocol> {
  const entityKey = createCacheKey(entityHash, accountAddress)
  const pendingRemovals = getCacheEntry<PendingRemovalsData>(
    PENDING_REMOVALS_CACHE_KEY,
    entityKey,
  )

  if (!pendingRemovals || pendingRemovals.length === 0) return ports

  const filteredPorts = { ...ports }
  pendingRemovals.forEach((portNumber) => {
    delete filteredPorts[portNumber]
  })

  return filteredPorts
}

/**
 * Extracts the SSH forwarded port (port 22's destination) from the ports array
 * Returns the destination port or undefined if not mapped yet
 */
export function getSSHForwardedPort(
  ports: ForwardedPort[],
): string | undefined {
  const sshPort = ports.find((port) => port.source === '22')
  return sshPort?.destination
}
