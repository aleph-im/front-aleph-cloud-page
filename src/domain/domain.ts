import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { aggregate } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import {
  AddDomainTarget,
  EntityType,
  apiServer,
  defaultDomainAggregateKey,
  defaultDomainChannel,
} from '../helpers/constants'
import { EntityManager } from './types'
import { domainSchema, domainsSchema } from '@/helpers/schemas/domain'

export { AddDomainTarget }

export type DomainAggregateItem = {
  type: AddDomainTarget | EntityType.Program | EntityType.Instance
  message_id: string
  programType?: EntityType.Instance | EntityType.Program
  updated_at: string
}

export type DomainAggregate = Record<string, DomainAggregateItem | null>

export type AddDomain = {
  name: string
  target: AddDomainTarget | EntityType.Program | EntityType.Instance
  programType: EntityType.Instance | EntityType.Program
  ref: string
}

export type Domain = Omit<AddDomain, 'programType'> & {
  type: EntityType.Domain
  id: string
  confirmed?: boolean
  programType?: EntityType.Instance | EntityType.Program
  updated_at: string
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

export class DomainManager implements EntityManager<Domain, AddDomain> {
  static addSchema = domainSchema
  static addManySchema = domainsSchema

  constructor(
    protected account: Account,
    protected key = defaultDomainAggregateKey,
    protected channel = defaultDomainChannel,
  ) {}

  async getAll(): Promise<Domain[]> {
    try {
      const response: Record<string, unknown> = await aggregate.Get({
        address: this.account.address,
        keys: [this.key],
        APIServer: apiServer,
      })

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
    const content = {
      message_id: domain.ref,
      type: domain.target,
      programType: domain.programType,
      updated_at: new Date().toISOString(),
    }

    try {
      await aggregate.Publish({
        account: this.account,
        key: this.key,
        channel: this.channel,
        content,
        APIServer: apiServer,
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async add(
    domains: AddDomain | AddDomain[],
    throwOnCollision?: boolean,
  ): Promise<Domain[]> {
    domains = Array.isArray(domains) ? domains : [domains]

    domains = await this.parseDomains(domains, throwOnCollision)

    try {
      if (!domains.length) return []

      const content: DomainAggregate = domains.reduce((ac, cv) => {
        const { name, ref, target, programType } = cv

        console.log('programType', programType)
        console.log('target', target)

        const domain = {
          message_id: ref,
          programType,
          type: target === AddDomainTarget.IPFS ? target : programType,
          updated_at: new Date().toISOString(),
        }

        // @note: legacy domains don't include programType (default to Instance)
        if (target === AddDomainTarget.Program) {
          domain.programType = cv.programType || EntityType.Instance
        }

        ac[name] = domain

        return ac
      }, {} as DomainAggregate)

      const response = await aggregate.Publish({
        account: this.account,
        key: this.key,
        channel: this.channel,
        content,
      })

      return this.parseNewAggregate(response)
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(domainOrId: string | Domain): Promise<void> {
    domainOrId = typeof domainOrId === 'string' ? domainOrId : domainOrId.id

    const content: DomainAggregate = {
      [domainOrId]: null,
    }

    try {
      await aggregate.Publish({
        account: this.account,
        key: this.key,
        channel: this.channel,
        content,
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async checkStatus(domain: Domain): Promise<DomainStatus> {
    const query = await fetch(`https://api.dns.public.aleph.sh/domain/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain.name,
        owner: this.account.address,
        target: domain.target,
      }),
    })
    const response = await query.json()
    return response
  }

  protected async parseDomains(
    domains: AddDomain[],
    throwOnCollision = true,
  ): Promise<AddDomain[]> {
    domains = await DomainManager.addManySchema.parseAsync(domains)

    const currentDomains = await this.getAll()
    const currentDomainSet = new Set<string>(currentDomains.map((d) => d.name))

    if (!throwOnCollision) {
      return domains.filter((domain) => !currentDomainSet.has(domain.name))
    } else {
      return domains.map((domain: AddDomain) => {
        if (!currentDomainSet.has(domain.name)) return domain
        throw new Error(
          `Domain name already used by another resource: ${domain.name}`,
        )
      })
    }
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseAggregate(response: any): Domain[] {
    const domains = response[this.key] as DomainAggregate
    return this.parseAggregateItems(domains)
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseNewAggregate(response: any): Domain[] {
    const domains = response.content.content as DomainAggregate
    return this.parseAggregateItems(domains)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseAggregateItems(aggregate: DomainAggregate): Domain[] {
    return Object.entries(aggregate)
      .filter(([, value]) => value !== null)
      .map(([key, value]) =>
        this.parseAggregateItem(key, value as DomainAggregateItem),
      )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseAggregateItem(
    name: string,
    content: DomainAggregateItem,
  ): Domain {
    const { message_id, type } = content
    // @note: legacy domains don't have updated_at property
    // Cast to string to avoid type errors
    const updated_at = content?.updated_at || 'unknown'

    const domain: Domain = {
      type: EntityType.Domain,
      id: name,
      name,
      target: type,
      ref: message_id,
      confirmed: true,
      updated_at: updated_at,
    }

    // @note: legacy domains don't include programType (default to Instance)
    if (type === AddDomainTarget.Program) {
      domain.programType = content.programType || EntityType.Instance
    }

    return domain
  }
}
