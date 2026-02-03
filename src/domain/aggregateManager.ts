import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { EntityManager } from './types'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'

export type AggregateContent<T> = Record<string, T | null>

export abstract class AggregateManager<Entity, AddEntity, AggregateItem>
  implements EntityManager<Entity, AddEntity>
{
  protected abstract addStepType: CheckoutStepType
  protected abstract delStepType: CheckoutStepType

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected key: string,
    protected channel: string,
  ) {}

  // Default implementation for getEntityId - assumes entity has 'id' property
  getEntityId(entity: Entity): string {
    return (entity as any).id
  }

  // Default implementation for getEntityDate - assumes entity has 'date' property
  getEntityDate(entity: Entity): string {
    return (entity as any).date
  }

  // Default implementation for buildAggregateContent - can be overridden for complex logic
  buildAggregateContent(
    entity: AddEntity | AddEntity[],
  ): AggregateContent<AggregateItem> {
    const items = Array.isArray(entity) ? entity : [entity]
    return items.reduce((ac, item) => {
      const key = this.getKeyFromAddEntity(item)
      const content = this.buildAggregateItemContent(item)
      ac[key] = content
      return ac
    }, {} as AggregateContent<AggregateItem>)
  }

  // Default implementations for checkout steps
  async getAddSteps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _entity?: AddEntity | AddEntity[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: any[]
  ): Promise<CheckoutStepType[]> {
    return [this.addStepType]
  }

  async getDelSteps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _entity?: string | Entity | (string | Entity)[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: any[]
  ): Promise<CheckoutStepType[]> {
    return [this.delStepType]
  }

  async getUpdateSteps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _oldKey?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _newKey?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _content?: AggregateItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._args: any[]
  ): Promise<CheckoutStepType[]> {
    return [this.addStepType]
  }

  // Default implementation for parseAggregateItem
  protected parseAggregateItem(key: string, content: AggregateItem): Entity {
    const entityFields = this.parseEntityFromAggregateItem(key, content)

    // Only set default timestamps if not provided by subclass
    const hasTimestamps =
      (entityFields as any).updated_at && (entityFields as any).date
    if (!hasTimestamps) {
      const now = new Date().toISOString()
      const date = now.slice(0, 19).replace('T', ' ')

      return {
        id: key,
        updated_at: (entityFields as any).updated_at || date,
        date: (entityFields as any).date || date,
        ...entityFields,
      } as Entity
    }

    return {
      id: key,
      ...entityFields,
    } as Entity
  }

  async getAll(): Promise<Entity[]> {
    if (!this.account) return []

    try {
      const response: Record<string, unknown> =
        await this.sdkClient.fetchAggregate(this.account.address, this.key)

      return this.parseAggregate(response)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Entity | undefined> {
    const entities = await this.getAll()
    return entities.find((entity) => this.getEntityId(entity) === id)
  }

  async add(entity: AddEntity | AddEntity[]): Promise<Entity[]> {
    const steps = this.addSteps(entity)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(
    entity: AddEntity | AddEntity[],
  ): AsyncGenerator<void, Entity[], void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      const content = this.buildAggregateContent(entity)

      // @note: Aggregate all signatures in 1 step
      yield
      const response = await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content,
      })

      return this.parseNewAggregate(response)
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async del(entityOrId: string | Entity): Promise<void> {
    const id =
      typeof entityOrId === 'string' ? entityOrId : this.getEntityId(entityOrId)

    const content: AggregateContent<AggregateItem> = {
      [id]: null,
    }

    try {
      if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
        throw Err.InvalidAccount

      await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content,
      })
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async *delSteps(
    entitiesOrIds: string | Entity | (string | Entity)[],
  ): AsyncGenerator<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    const items = Array.isArray(entitiesOrIds) ? entitiesOrIds : [entitiesOrIds]
    if (items.length === 0) return

    try {
      // @note: Aggregate all signatures in 1 step
      yield
      await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content: items.reduce((ac, cv) => {
          const id = typeof cv === 'string' ? cv : this.getEntityId(cv)
          ac[id] = null
          return ac
        }, {} as AggregateContent<AggregateItem>),
      })
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async update(
    oldKey: string,
    newKey: string,
    content: AggregateItem,
  ): Promise<Entity> {
    const steps = this.updateSteps(oldKey, newKey, content)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *updateSteps(
    oldKey: string,
    newKey: string,
    content: AggregateItem,
  ): AsyncGenerator<void, Entity, void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      const aggregateContent: AggregateContent<AggregateItem> = {}

      // If the key is changing, delete the old key
      if (oldKey !== newKey) {
        aggregateContent[oldKey] = null
      }

      // Add or update the new key with the content
      aggregateContent[newKey] = content

      // @note: Aggregate deletion and addition in 1 step
      yield
      const response = await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content: aggregateContent,
      })

      const entities = this.parseNewAggregate(response)
      const updatedEntity = entities.find((e) => this.getEntityId(e) === newKey)

      if (!updatedEntity) throw Err.RequestFailed('Updated entity not found')

      return updatedEntity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseAggregate(response: any): Entity[] {
    const aggregate = response as AggregateContent<AggregateItem>
    console.log('aggregate', aggregate)
    return this.parseAggregateItems(aggregate).sort((a, b) =>
      this.getEntityDate(b).localeCompare(this.getEntityDate(a)),
    )
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseNewAggregate(response: any): Entity[] {
    const aggregate = response.content
      .content as AggregateContent<AggregateItem>

    return this.parseAggregateItems(aggregate)
  }

  protected parseAggregateItems(
    aggregate: AggregateContent<AggregateItem>,
  ): Entity[] {
    return Object.entries(aggregate)
      .filter(([, value]) => value !== null)
      .map(([key, value]) =>
        this.parseAggregateItem(key, value as AggregateItem),
      )
  }

  // Abstract methods that subclasses must implement
  abstract getKeyFromAddEntity(entity: AddEntity): string
  abstract buildAggregateItemContent(entity: AddEntity): AggregateItem
  abstract parseEntityFromAggregateItem(
    key: string,
    content: AggregateItem,
  ): Partial<Entity>
}
