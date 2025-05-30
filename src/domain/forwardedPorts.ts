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
    return entities.find((entity) => entity.entityHash === entityHash)
  }
}
