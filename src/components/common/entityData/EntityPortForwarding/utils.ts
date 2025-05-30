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

  // Check system port (SSH)
  if (portNumber === 22) {
    return { isValid: false, error: 'Port 22 is reserved for SSH' }
  }

  return { isValid: true }
}

export function validatePortBatch(
  ports: { port: string; tcp: boolean; udp: boolean }[],
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

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function hasUnmappedPorts(ports: ForwardedPort[]): boolean {
  return ports.some((port) => !port.destination)
}
