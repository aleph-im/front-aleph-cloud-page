import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import {
  defaultConsoleChannel,
  defaultPermissionsAggregateKey,
} from '@/helpers/constants'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import { AggregateManager } from './aggregateManager'
import { MessageType } from '@aleph-sdk/message'

// API types (from Aleph backend)
export type PermissionsAggregateItem = {
  address: string
  alias?: string
  channels?: string[]
  types?: MessageType[]
  post_types?: string[]
  aggregate_keys?: string[]
  updated_at?: string
  created_at?: string
}

export type AddPermissions = PermissionsAggregateItem & {
  alias: string
  updated_at: string
  created_at: string
}

export type PermissionsConfig = {
  authorizations: PermissionsAggregateItem[]
}

// Domain types (used by the app)
export type DomainBaseMessageTypePermissions = {
  type: Exclude<MessageType, MessageType.post | MessageType.aggregate>
  authorized: boolean
}

export type DomainPostPermissionsItem = {
  type: MessageType.post
  postTypes: string[] | []
  authorized: boolean
}

export type DomainAggregatePermissionsItem = {
  type: MessageType.aggregate
  aggregateKeys: string[] | []
  authorized: boolean
}

export type DomainMessageTypePermissionsItem =
  | DomainPostPermissionsItem
  | DomainAggregatePermissionsItem
  | DomainBaseMessageTypePermissions

export type DomainAccountPermissions = {
  id: string // account address
  alias?: string
  channels: string[] | []
  messageTypes: DomainMessageTypePermissionsItem[]
}

export type DomainPermissions = DomainAccountPermissions[]

// Domain Permission type (used throughout the app)
export type Permission = {
  id: string
  address: string
  alias?: string
  channels: string[] | null
  messageTypes: DomainMessageTypePermissionsItem[]
  updated_at?: string
  created_at?: string
}

export class PermissionsManager extends AggregateManager<
  Permission,
  AddPermissions,
  PermissionsAggregateItem
> {
  protected addStepType: CheckoutStepType = 'permissions'
  protected delStepType: CheckoutStepType = 'permissionsDel'

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected key = defaultPermissionsAggregateKey,
    protected channel = defaultConsoleChannel,
  ) {
    super(account, sdkClient, key, channel)
  }

  async getAll(): Promise<Permission[]> {
    if (!this.account) return []

    try {
      const response: PermissionsConfig = await this.sdkClient.fetchAggregate(
        this.account.address,
        this.key,
      )

      return this.parsePermissionsConfig(response)
    } catch (err) {
      return []
    }
  }

  /**
   * Helper method to parse API message types into domain format
   */
  private parseMessageTypesToDomain(
    types: MessageType[] | undefined,
    postTypes: string[] | undefined,
    aggregateKeys: string[] | undefined,
  ): DomainMessageTypePermissionsItem[] {
    const allMessageTypes = [
      MessageType.post,
      MessageType.aggregate,
      MessageType.instance,
      MessageType.program,
      MessageType.store,
    ]

    const authorizedTypes = new Set(types || [])
    const messageTypes: DomainMessageTypePermissionsItem[] = []

    // Process each message type
    for (const type of allMessageTypes) {
      const authorized = authorizedTypes.has(type)

      if (type === MessageType.post) {
        messageTypes.push({
          type: MessageType.post,
          postTypes:
            authorized && postTypes && postTypes.length > 0 ? postTypes : null,
          authorized,
        })
      } else if (type === MessageType.aggregate) {
        messageTypes.push({
          type: MessageType.aggregate,
          aggregateKeys:
            authorized && aggregateKeys && aggregateKeys.length > 0
              ? aggregateKeys
              : null,
          authorized,
        })
      } else {
        messageTypes.push({
          type,
          authorized,
        } as DomainBaseMessageTypePermissions)
      }
    }

    return messageTypes
  }

  protected parsePermissionsConfig(config: PermissionsConfig): Permission[] {
    if (!config.authorizations || !Array.isArray(config.authorizations)) {
      return []
    }

    return config.authorizations.map((auth, index) => {
      return {
        id: auth.address || `permission-${index}`,
        address: auth.address,
        alias: auth.alias,
        channels:
          auth.channels && auth.channels.length > 0 ? auth.channels : null,
        messageTypes: this.parseMessageTypesToDomain(
          auth.types,
          auth.post_types,
          auth.aggregate_keys,
        ),
        updated_at: auth.updated_at,
        created_at: auth.created_at,
      }
    })
  }

  getKeyFromAddEntity(entity: AddPermissions): string {
    return entity.address
  }

  buildAggregateItemContent(entity: AddPermissions): PermissionsAggregateItem {
    return {
      types: entity.types,
      address: entity.address,
      channels: entity.channels,
      post_types: entity.post_types || [],
      aggregate_keys: entity.aggregate_keys || [],
    }
  }

  parseEntityFromAggregateItem(
    _address: string,
    content: PermissionsAggregateItem,
  ): Partial<Permission> {
    return {
      address: content.address,
      alias: content.alias,
      channels:
        content.channels && content.channels.length > 0
          ? content.channels
          : null,
      messageTypes: this.parseMessageTypesToDomain(
        content.types,
        content.post_types,
        content.aggregate_keys,
      ),
      updated_at: content.updated_at,
      created_at: content.created_at,
    }
  }
}
