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
import { AggregateContent, AggregateManager } from './aggregateManager'
import { MessageType } from '@aleph-sdk/message'
import { newPermissionSchema } from '@/helpers/schemas/permissions'

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
  revoked?: boolean
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
  revoked: boolean
}

export type Permissions = AccountPermissions[]

export class PermissionsManager extends AggregateManager<
  AccountPermissions,
  AddPermissionsApi,
  PermissionsAggregateItemApi
> {
  static addSchema = newPermissionSchema

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
          revoked: false,
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
      alias: entity.alias,
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

  /**
   * Converts domain AccountPermissions to AddPermissionsApi format
   */
  private convertToAddPermissionsApi(
    permission: AccountPermissions,
  ): AddPermissionsApi {
    const authorizedTypes: MessageType[] = []
    let postTypes: string[] = []
    let aggregateKeys: string[] = []

    for (const mt of permission.messageTypes) {
      if (!mt.authorized) continue

      authorizedTypes.push(mt.type)

      if (mt.type === MessageType.post) {
        postTypes = (mt as PostPermissions).postTypes || []
      } else if (mt.type === MessageType.aggregate) {
        aggregateKeys = (mt as AggregatePermissions).aggregateKeys || []
      }
    }

    return {
      address: permission.id,
      alias: permission.alias || '',
      channels: permission.channels.length > 0 ? permission.channels : [],
      types: authorizedTypes.length > 0 ? authorizedTypes : [],
      post_types: postTypes,
      aggregate_keys: aggregateKeys,
      revoked: permission.revoked,
    }
  }

  /**
   * Fetches the raw aggregate data from the API
   */
  private async fetchRawAggregate(): Promise<PermissionsConfigApi | null> {
    if (!this.account) return null

    try {
      return await this.sdkClient.fetchAggregate(this.account.address, this.key)
    } catch {
      return null
    }
  }

  /**
   * Builds the aggregate content merging with existing permissions.
   * Items with revoked=true are removed from the authorizations list.
   */
  private async buildPermissionsAggregateContent(
    entity: AddPermissionsApi | AddPermissionsApi[],
  ): Promise<AggregateContent<PermissionsAggregateItemApi>> {
    const items = Array.isArray(entity) ? entity : [entity]

    const existingConfig = await this.fetchRawAggregate()
    const existingAuthorizations = existingConfig?.authorizations || []

    const updatedAuthorizations = [...existingAuthorizations]

    for (const item of items) {
      const existingIndex = updatedAuthorizations.findIndex(
        (auth) => auth.address === item.address,
      )

      if (item.revoked) {
        if (existingIndex >= 0) {
          updatedAuthorizations.splice(existingIndex, 1)
        }
      } else {
        const newItem = this.buildAggregateItemContent(item)

        if (existingIndex >= 0) {
          updatedAuthorizations[existingIndex] = newItem
        } else {
          updatedAuthorizations.push(newItem)
        }
      }
    }

    return {
      authorizations: updatedAuthorizations,
    } as unknown as AggregateContent<PermissionsAggregateItemApi>
  }

  /**
   * Overrides addSteps to handle the permissions-specific aggregate structure
   */
  async *addSteps(
    entity: AddPermissionsApi | AddPermissionsApi[],
  ): AsyncGenerator<void, AccountPermissions[], void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient)) {
      throw new Error('Authenticated client required')
    }

    const content = await this.buildPermissionsAggregateContent(entity)

    yield
    await this.sdkClient.createAggregate({
      key: this.key,
      channel: this.channel,
      content,
    })

    return this.getAll()
  }

  /**
   * Adds a new account permission, merging with existing permissions
   */
  async addNewAccountPermission(
    permission: AccountPermissions,
  ): Promise<AccountPermissions[]> {
    const addPermissionsApi = this.convertToAddPermissionsApi(permission)
    return this.add(addPermissionsApi)
  }

  /**
   * Returns the steps generator for adding a new account permission.
   * Use this with checkout notification flow.
   */
  addNewAccountPermissionSteps(
    permission: AccountPermissions,
  ): AsyncGenerator<void, AccountPermissions[], void> {
    const addPermissionsApi = this.convertToAddPermissionsApi(permission)
    return this.addSteps(addPermissionsApi)
  }

  /**
   * Updates multiple permissions at once.
   * Permissions with revoked=true are removed from the authorizations list.
   * Other permissions are updated/added.
   */
  async updatePermissions(
    permissions: AccountPermissions[],
  ): Promise<AccountPermissions[]> {
    const addPermissionsApi = permissions.map((p) =>
      this.convertToAddPermissionsApi(p),
    )
    return this.add(addPermissionsApi)
  }

  /**
   * Returns the steps generator for updating permissions.
   * Use this with checkout notification flow.
   */
  updatePermissionsSteps(
    permissions: AccountPermissions[],
  ): AsyncGenerator<void, AccountPermissions[], void> {
    const addPermissionsApi = permissions.map((p) =>
      this.convertToAddPermissionsApi(p),
    )
    return this.addSteps(addPermissionsApi)
  }
}
