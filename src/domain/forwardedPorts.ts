import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import {
  defaultConsoleChannel,
  defaultPortForwardingAggregateKey,
} from '@/helpers/constants'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import { AggregateManager } from './aggregateManager'
import { isSystemPort } from '@/components/common/entityData/EntityPortForwarding/utils'

export type PortProtocol = {
  tcp: boolean
  udp: boolean
}

export type EntityPortsConfig = {
  ports: Record<number, PortProtocol>
}

export type ForwardedPortsAggregate = Record<string, EntityPortsConfig | null>

export type AddForwardedPorts = {
  entityHash: string
  ports: Record<number, PortProtocol>
}

export type ForwardedPorts = AddForwardedPorts & {
  id: string
  updated_at: string
  date: string
}

export class ForwardedPortsManager extends AggregateManager<
  ForwardedPorts,
  AddForwardedPorts,
  EntityPortsConfig
> {
  protected addStepType: CheckoutStepType = 'portForwarding'
  protected delStepType: CheckoutStepType = 'portForwardingDel'

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected key = defaultPortForwardingAggregateKey,
    protected channel = defaultConsoleChannel,
  ) {
    super(account, sdkClient, key, channel)
  }

  getKeyFromAddEntity(entity: AddForwardedPorts): string {
    return entity.entityHash
  }

  buildAggregateItemContent(entity: AddForwardedPorts): EntityPortsConfig {
    return {
      ports: entity.ports,
    }
  }

  parseEntityFromAggregateItem(
    key: string,
    content: EntityPortsConfig,
  ): Partial<ForwardedPorts> {
    return {
      entityHash: key,
      ports: content.ports,
    }
  }

  async getByEntityHash(
    entityHash: string,
  ): Promise<ForwardedPorts | undefined> {
    const entities = await this.getAll()
    const entity = entities.find((entity) => entity.entityHash === entityHash)

    if (!entity) {
      return undefined
    }

    return entity
  }

  async delByEntityHash(entityHash: string): Promise<void> {
    await this.del(entityHash)
  }

  async addMultiplePorts(
    entityHash: string,
    newPorts: { port: string; tcp: boolean; udp: boolean }[],
  ): Promise<ForwardedPorts> {
    // Get existing ports
    const existingPorts = await this.getByEntityHash(entityHash)
    const currentPorts = existingPorts?.ports || {}

    // Convert new ports to the correct format and merge
    const newPortsMap: Record<number, PortProtocol> = {}
    newPorts.forEach((port) => {
      const portNumber = parseInt(port.port, 10)
      newPortsMap[portNumber] = {
        tcp: port.tcp,
        udp: port.udp,
      }
    })

    // Merge with existing ports
    const updatedPorts = { ...currentPorts, ...newPortsMap }

    // Check if total ports exceed the maximum limit (20)
    const totalPorts = Object.keys(updatedPorts).length
    if (totalPorts > 20) {
      throw new Error(
        `Maximum 20 ports allowed. Current total would be ${totalPorts}`,
      )
    }

    // Save to aggregate
    const [result] = await this.add({
      entityHash,
      ports: updatedPorts,
    })

    return result
  }

  async removePort(entityHash: string, portSource: string): Promise<void> {
    // Get current ports and remove the specified one
    const existingPorts = await this.getByEntityHash(entityHash)
    const currentPorts = existingPorts?.ports || {}

    // Create new ports object without the removed port
    const updatedPorts = { ...currentPorts }
    delete updatedPorts[parseInt(portSource, 10)]

    // Save updated ports or delete entire entry if no ports left
    if (Object.keys(updatedPorts).length > 0) {
      await this.add({
        entityHash,
        ports: updatedPorts,
      })
    } else {
      await this.del(entityHash)
    }
  }

  async syncWithPortStatus(
    entityHash: string,
  ): Promise<ForwardedPorts | undefined> {
    const existingPorts = await this.getByEntityHash(entityHash)
    if (!existingPorts) return undefined

    // Update is handled by the UI layer
    // This method mainly serves as a data access point
    return existingPorts
  }

  validatePortEntry(port: { port: string; tcp: boolean; udp: boolean }): {
    isValid: boolean
    error?: string
  } {
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

  async validatePortConflicts(
    entityHash: string,
    newPorts: { port: string; tcp: boolean; udp: boolean }[],
  ): Promise<{ hasConflicts: boolean; conflicts: string[] }> {
    const existingPorts = await this.getByEntityHash(entityHash)
    const currentPorts = existingPorts?.ports || {}
    const conflicts: string[] = []

    newPorts.forEach((newPort) => {
      const portNumber = parseInt(newPort.port, 10)
      if (currentPorts[portNumber]) {
        conflicts.push(newPort.port)
      }
    })

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
    }
  }
}
