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

export type Permission = PermissionsAggregateItem

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

  protected parsePermissionsConfig(config: PermissionsConfig): Permission[] {
    if (!config.authorizations || !Array.isArray(config.authorizations)) {
      return []
    }

    return config.authorizations.map((auth, index) => {
      return {
        id: auth.address || `permission-${index}`,
        address: auth.address,
        types: auth.types || [],
        channels: auth.channels || [],
        post_types: auth.post_types || [],
        aggregate_keys: auth.aggregate_keys || [],
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
      types: content.types,
      channels: content.channels,
      post_types: content.post_types,
      aggregate_keys: content.aggregate_keys,
      updated_at: content.updated_at,
      created_at: content.created_at,
    }
  }
}
