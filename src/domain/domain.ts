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
import { domainSchema, domainsSchema } from '@/helpers/schemas/domain'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import { FunctionRuntimeId } from './runtime'
import Err from '@/helpers/errors'
import { AggregateManager } from './aggregateManager'

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

export class DomainManager extends AggregateManager<
  Domain,
  AddDomain,
  DomainAggregateItem
> {
  static addSchema = domainSchema
  static addManySchema = domainsSchema
  protected addStepType: CheckoutStepType = 'domain'
  protected delStepType: CheckoutStepType = 'domainDel'

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected key = defaultDomainAggregateKey,
    protected channel = defaultDomainChannel,
  ) {
    super(account, sdkClient, key, channel)
  }

  getKeyFromAddEntity(entity: AddDomain): string {
    return entity.name
  }

  buildAggregateItemContent(entity: AddDomain): DomainAggregateItem {
    const { ref, target } = entity
    const isConfidential = target == EntityDomainType.Confidential
    const type = isConfidential ? EntityDomainType.Instance : target
    return {
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
  }

  async retry(domain: Domain) {
    const addDomain: AddDomain = {
      name: domain.name,
      target: domain.target,
      ref: domain.ref,
    }

    return super.add(addDomain)
  }

  async add(
    domains: AddDomain | AddDomain[],
    onCollision?: DomainCollisionType,
  ): Promise<Domain[]> {
    const parsedDomains = await this.parseDomains(
      Array.isArray(domains) ? domains : [domains],
      onCollision,
    )
    if (!parsedDomains.length) return []

    return super.add(parsedDomains)
  }

  async *addSteps(
    domains: AddDomain | AddDomain[],
    onCollision?: DomainCollisionType,
  ): AsyncGenerator<void, Domain[], void> {
    const parsedDomains = await this.parseDomains(
      Array.isArray(domains) ? domains : [domains],
      onCollision,
    )
    if (!parsedDomains.length) return []

    return yield* super.addSteps(parsedDomains)
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

  parseEntityFromAggregateItem(
    name: string,
    content: DomainAggregateItem,
  ): Partial<Domain> {
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

    return {
      type: EntityType.Domain,
      name,
      target,
      ref: message_id,
      confirmed: true,
      updated_at: date,
      date,
      size: 0,
      refUrl: `/${ref_path}/${message_id}`,
    }
  }

  async *delSteps(
    domainsOrIds: string | Domain | (string | Domain)[],
  ): AsyncGenerator<void> {
    yield* super.delSteps(domainsOrIds)
  }
}
