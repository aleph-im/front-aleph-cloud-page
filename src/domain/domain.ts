import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import {
  EntityDomainType,
  EntityType,
  defaultDomainAggregateKey,
  defaultDomainChannel,
} from '@/helpers/constants'
import { EntityManager } from './types'
import { domainSchema, domainsSchema } from '@/helpers/schemas/domain'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import { FunctionRuntimeId } from './runtime'
import Err from '@/helpers/errors'

export { EntityDomainType }

export type DomainAggregateItem = {
  type: EntityDomainType
  programType: EntityDomainType
  message_id: string
  updated_at: string
  options?: Record<string, unknown>
}

export type DomainAggregate = Record<string, DomainAggregateItem | null>

export type AddDomain = {
  name: string
  target: EntityDomainType
  ref: string
}

export type Domain = AddDomain & {
  type: EntityType.Domain
  id: string
  updated_at: string
  date: string
  size: number
  refUrl: string
  confirmed?: boolean
}

export type DomainStatus = {
  status: boolean
  tasks_status: {
    cname: boolean
    delegation: boolean
    owner_proof: boolean
  }
  err: string
  help: string
}

enum DomainCollision {
  throw = 'throw',
  ignore = 'ignore',
  override = 'override',
}

type DomainCollisionType = keyof typeof DomainCollision

export class DomainManager implements EntityManager<Domain, AddDomain> {
  static addSchema = domainSchema
  static addManySchema = domainsSchema

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected key = defaultDomainAggregateKey,
    protected channel = defaultDomainChannel,
  ) {}

  async getAll(): Promise<Domain[]> {
    if (!this.account) return []

    try {
      const response: Record<string, unknown> =
        await this.sdkClient.fetchAggregate(this.account.address, this.key)

      return this.parseAggregate(response)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Domain | undefined> {
    const entities = await this.getAll()
    return entities.find((entity) => entity.id === id)
  }

  async retry(domain: Domain) {
    const isConfidential = domain.target == EntityDomainType.Confidential
    const type = isConfidential ? EntityDomainType.Instance : domain.target
    const content: DomainAggregate = {
      [domain.name]: {
        message_id: domain.ref,
        type,
        programType: type,
        updated_at: new Date().toISOString(),
        ...(type === EntityDomainType.IPFS
          ? {
              options: { catch_all_path: '/404.html' },
            }
          : isConfidential
            ? {
                options: { confidential: true },
              }
            : {}),
      },
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

  async add(
    domains: AddDomain | AddDomain[],
    onCollision?: DomainCollisionType,
  ): Promise<Domain[]> {
    const steps = this.addSteps(domains, onCollision)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(
    domains: AddDomain | AddDomain[],
    onCollision?: DomainCollisionType,
  ): AsyncGenerator<void, Domain[], void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    domains = Array.isArray(domains) ? domains : [domains]

    domains = await this.parseDomains(domains, onCollision)
    if (!domains.length) return []

    try {
      const content: DomainAggregate = domains.reduce((ac, cv) => {
        const { name, ref, target } = cv
        const isConfidential = target == EntityDomainType.Confidential
        const type = isConfidential ? EntityDomainType.Instance : target
        ac[name] = {
          message_id: ref,
          type,
          programType: type,
          updated_at: new Date().toISOString(),
          ...(type === EntityDomainType.IPFS
            ? {
                options: { catch_all_path: '/404.html' },
              }
            : isConfidential
              ? {
                  options: { confidential: true },
                }
              : {}),
        }
        return ac
      }, {} as DomainAggregate)

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

  async del(domainOrId: string | Domain): Promise<void> {
    domainOrId = typeof domainOrId === 'string' ? domainOrId : domainOrId.id

    const content: DomainAggregate = {
      [domainOrId]: null,
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

  async checkStatus(domain: Domain): Promise<DomainStatus> {
    if (!this.account) throw Err.InvalidAccount

    const query = await fetch(`https://api.dns.public.aleph.sh/domain/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain.name,
        owner: this.account.address,
        target:
          domain.target == EntityDomainType.Confidential
            ? EntityDomainType.Instance
            : domain.target,
      }),
    })
    const response = await query.json()
    return response
  }

  async getAddSteps(
    domains: AddDomain | AddDomain[],
    onCollision?: DomainCollisionType,
  ): Promise<CheckoutStepType[]> {
    domains = Array.isArray(domains) ? domains : [domains]

    // @note: mock ref to bypass schema validation
    domains = domains.map((domain) => ({
      ...domain,
      ref: FunctionRuntimeId.Runtime1,
    }))

    domains = await this.parseDomains(domains, onCollision)

    // @note: Aggregate all signatures in 1 step
    // return domains.map(() => 'domain')
    return domains.length ? ['domain'] : []
  }

  protected async parseDomains(
    domains: AddDomain[],
    onCollision: DomainCollisionType = DomainCollision.throw,
  ): Promise<AddDomain[]> {
    domains = await DomainManager.addManySchema.parseAsync(domains)

    if (onCollision === DomainCollision.override) return domains

    const currentDomains = await this.getAll()
    const currentDomainSet = new Set<string>(currentDomains.map((d) => d.name))

    if (onCollision === DomainCollision.ignore)
      return domains.filter((domain) => !currentDomainSet.has(domain.name))

    return domains.map((domain: AddDomain) => {
      if (!currentDomainSet.has(domain.name)) return domain
      throw Err.DomainUsed(domain.name)
    })
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseAggregate(response: any): Domain[] {
    const domains = response as DomainAggregate
    return this.parseAggregateItems(domains).sort((a, b) =>
      b.date.localeCompare(a.date),
    )
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseNewAggregate(response: any): Domain[] {
    const domains = response.content.content as DomainAggregate
    return this.parseAggregateItems(domains)
  }

  protected parseAggregateItems(aggregate: DomainAggregate): Domain[] {
    return Object.entries(aggregate)
      .filter(([, value]) => value !== null)
      .map(([key, value]) =>
        this.parseAggregateItem(key, value as DomainAggregateItem),
      )
  }

  protected parseAggregateItem(
    name: string,
    content: DomainAggregateItem,
  ): Domain {
    const { message_id, type, updated_at, options } = content
    const target = options?.['confidential']
      ? EntityDomainType.Confidential
      : type
    const ref_path =
      type === EntityDomainType.Program
        ? 'computing/function'
        : type === EntityDomainType.Instance
          ? 'computing/instance'
          : type === EntityDomainType.Confidential
            ? 'computing/confidential'
            : 'storage/volume'
    let date = '-'
    try {
      date = updated_at?.slice(0, 19).replace('T', ' ') || '-'
    } catch (e) {}
    const domain: Domain = {
      type: EntityType.Domain,
      id: name,
      name,
      target,
      ref: message_id,
      confirmed: true,
      updated_at: date,
      date,
      size: 0,
      refUrl: `/${ref_path}/${message_id}`,
    }

    return domain
  }

  async getDelSteps(
    domainsOrIds: string | Domain | (string | Domain)[],
  ): Promise<CheckoutStepType[]> {
    domainsOrIds = Array.isArray(domainsOrIds) ? domainsOrIds : [domainsOrIds]
    // @note: Aggregate all signatures in 1 step
    // return domainsOrIds.map(() => 'domainDel')
    return domainsOrIds.length ? ['domainDel'] : []
  }

  async *delSteps(
    domainsOrIds: string | Domain | (string | Domain)[],
  ): AsyncGenerator<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    domainsOrIds = Array.isArray(domainsOrIds) ? domainsOrIds : [domainsOrIds]
    if (domainsOrIds.length === 0) return

    try {
      // @note: Aggregate all signatures in 1 step
      yield
      await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content: domainsOrIds.reduce((ac, cv) => {
          const name = typeof cv === 'string' ? cv : cv.name
          ac[name] = null
          return ac
        }, {} as DomainAggregate),
      })
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }
}
