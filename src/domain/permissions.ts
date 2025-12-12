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

// ==================================
// = API types (from Aleph backend) =
// ==================================

type PermissionsAggregateItemApi = {
  address: string
  alias?: string
  channels?: string[]
  types?: MessageType[]
  post_types?: string[]
  aggregate_keys?: string[]
}

type AddPermissionsApi = PermissionsAggregateItemApi & {
  alias: string
}

type PermissionsConfigApi = {
  authorizations: PermissionsAggregateItemApi[]
}

// ==================================
// = Domain types (used by the app) =
// ==================================

export type BaseMessageTypePermissions = {
  type: Exclude<MessageType, MessageType.post | MessageType.aggregate>
  authorized: boolean
}

export type PostPermissions = {
  type: MessageType.post
  postTypes: string[] | []
  authorized: boolean
}

export type AggregatePermissions = {
  type: MessageType.aggregate
  aggregateKeys: string[] | []
  authorized: boolean
}

export type MessageTypePermissions =
  | PostPermissions
  | AggregatePermissions
  | BaseMessageTypePermissions

export type AccountPermissions = {
  id: string // account address
  alias?: string
  channels: string[] | []
  messageTypes: MessageTypePermissions[]
  revoked?: boolean
}

export type Permissions = AccountPermissions[]

export class PermissionsManager extends AggregateManager<
  AccountPermissions,
  AddPermissionsApi,
  PermissionsAggregateItemApi
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

  async getAll(): Promise<AccountPermissions[]> {
    if (!this.account) return []

    try {
      const response: PermissionsConfigApi =
        await this.sdkClient.fetchAggregate(this.account.address, this.key)

      return this.mapPermissionsConfigApiToAccountPermissions(response)
    } catch (err) {
      return []
    }
  }

  /**
   * Maps API message types to domain format
   */
  private mapMessageTypesApiToMessageTypePermissions(
    types: MessageType[] | undefined,
    postTypes: string[] | undefined,
    aggregateKeys: string[] | undefined,
  ): MessageTypePermissions[] {
    const allMessageTypes = [
      MessageType.post,
      MessageType.aggregate,
      MessageType.instance,
      MessageType.program,
      MessageType.store,
      // @todo: should we include the forget message type?
      // MessageType.forget,
    ]

    const authorizedTypes = new Set(types || [])
    const messageTypes: MessageTypePermissions[] = []

    // Process each message type
    for (const type of allMessageTypes) {
      const authorized = authorizedTypes.has(type)

      if (type === MessageType.post) {
        messageTypes.push({
          type: MessageType.post,
          postTypes: authorized && postTypes?.length ? postTypes : [],
          authorized,
        })
      } else if (type === MessageType.aggregate) {
        messageTypes.push({
          type: MessageType.aggregate,
          aggregateKeys:
            authorized && aggregateKeys?.length ? aggregateKeys : [],
          authorized,
        })
      } else {
        messageTypes.push({
          type,
          authorized,
        } as BaseMessageTypePermissions)
      }
    }

    return messageTypes
  }

  protected mapPermissionsConfigApiToAccountPermissions(
    config: PermissionsConfigApi,
  ): AccountPermissions[] {
    if (!config.authorizations || !Array.isArray(config.authorizations)) {
      return []
    }
    return config.authorizations.map(
      (auth: PermissionsAggregateItemApi, index: number) => {
        return {
          id: auth.address || `permission-${index}`,
          alias: auth.alias,
          channels: auth.channels?.length ? auth.channels : [],
          messageTypes: this.mapMessageTypesApiToMessageTypePermissions(
            auth.types,
            auth.post_types,
            auth.aggregate_keys,
          ),
        }
      },
    )
  }

  getKeyFromAddEntity(entity: AddPermissionsApi): string {
    return entity.address
  }

  buildAggregateItemContent(
    entity: AddPermissionsApi,
  ): PermissionsAggregateItemApi {
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
    content: PermissionsAggregateItemApi,
  ): Partial<AccountPermissions> {
    return {
      id: content.address,
      alias: content.alias,
      channels:
        content.channels && content.channels.length > 0 ? content.channels : [],
      messageTypes: this.mapMessageTypesApiToMessageTypePermissions(
        content.types,
        content.post_types,
        content.aggregate_keys,
      ),
    }
  }
}
