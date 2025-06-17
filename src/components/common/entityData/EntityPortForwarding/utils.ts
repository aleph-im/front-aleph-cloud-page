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
const CACHE_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes

export type PendingPortEntry = {
  entityHash: string
  ports: Record<number, PortProtocol>
  timestamp: number
}

export type PendingPortsCache = Record<string, PendingPortEntry>

function getPendingPortsCache(): PendingPortsCache {
  try {
    const cached = localStorage.getItem(PENDING_PORTS_CACHE_KEY)
    if (!cached) return {}

    const cache: PendingPortsCache = JSON.parse(cached)
    const now = Date.now()

    // Clean expired entries
    const validCache: PendingPortsCache = {}
    Object.entries(cache).forEach(([key, entry]) => {
      if (now - entry.timestamp < CACHE_EXPIRY_MS) {
        validCache[key] = entry
      }
    })

    // Update cache if any entries were cleaned
    if (Object.keys(validCache).length !== Object.keys(cache).length) {
      localStorage.setItem(PENDING_PORTS_CACHE_KEY, JSON.stringify(validCache))
    }

    return validCache
  } catch (error) {
    console.warn('Failed to read pending ports cache:', error)
    return {}
  }
}

function setPendingPortsCache(cache: PendingPortsCache): void {
  try {
    localStorage.setItem(PENDING_PORTS_CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn('Failed to write pending ports cache:', error)
  }
}

export function addPendingPorts(
  entityHash: string,
  newPorts: Record<number, PortProtocol>,
): void {
  const cache = getPendingPortsCache()
  const existing = cache[entityHash]

  cache[entityHash] = {
    entityHash,
    ports: existing ? { ...existing.ports, ...newPorts } : newPorts,
    timestamp: Date.now(),
  }

  setPendingPortsCache(cache)
}

export function removePendingPorts(
  entityHash: string,
  portNumbers: number[],
): void {
  const cache = getPendingPortsCache()
  const existing = cache[entityHash]

  if (!existing) return

  const updatedPorts = { ...existing.ports }
  portNumbers.forEach((portNumber) => {
    delete updatedPorts[portNumber]
  })

  if (Object.keys(updatedPorts).length === 0) {
    delete cache[entityHash]
  } else {
    cache[entityHash] = {
      ...existing,
      ports: updatedPorts,
      timestamp: Date.now(),
    }
  }

  setPendingPortsCache(cache)
}

export function clearPendingPorts(entityHash: string): void {
  const cache = getPendingPortsCache()
  delete cache[entityHash]
  setPendingPortsCache(cache)
}

export function getPendingPortsForEntity(
  entityHash: string,
): Record<number, PortProtocol> {
  const cache = getPendingPortsCache()
  return cache[entityHash]?.ports || {}
}

export function mergePendingPortsWithAggregate(
  entityHash: string,
  aggregatePorts: Record<number, PortProtocol>,
): Record<number, PortProtocol> {
  const pendingPorts = getPendingPortsForEntity(entityHash)
  return { ...aggregatePorts, ...pendingPorts }
}

export function cleanupConfirmedPorts(
  entityHash: string,
  aggregatePorts: Record<number, PortProtocol>,
): void {
  const pendingPorts = getPendingPortsForEntity(entityHash)
  const confirmedPortNumbers: number[] = []

  // Find which pending ports are now confirmed in the aggregate
  Object.keys(pendingPorts).forEach((portStr) => {
    const portNumber = parseInt(portStr, 10)
    const pendingPort = pendingPorts[portNumber]
    const aggregatePort = aggregatePorts[portNumber]

    // If the port exists in aggregate with matching protocols, it's confirmed
    if (
      aggregatePort &&
      aggregatePort.tcp === pendingPort.tcp &&
      aggregatePort.udp === pendingPort.udp
    ) {
      confirmedPortNumbers.push(portNumber)
    }
  })

  // Remove confirmed ports from cache
  if (confirmedPortNumbers.length > 0) {
    removePendingPorts(entityHash, confirmedPortNumbers)
  }
}
