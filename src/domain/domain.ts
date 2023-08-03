import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { aggregate } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import {
  EntityType,
  defaultDomainAggregateKey,
  defaultDomainChannel,
} from '../helpers/constants'
import { EntityManager } from './types'
import { isValidItemHash } from '@/helpers/utils'

export type DomainAggregateItem = {
  type: AddDomainTarget
  message_id: string
  programType?: EntityType.Instance | EntityType.Program
}

export type DomainAggregate = Record<string, DomainAggregateItem | null>

export enum AddDomainTarget {
  IPFS = 'ipfs',
  Program = 'program',
}

export type AddDomain = {
  name: string
  target: AddDomainTarget
  programType: EntityType.Instance | EntityType.Program
  ref: string
}

export type Domain = Omit<AddDomain, 'programType'> & {
  type: EntityType.Domain
  id: string
  confirmed?: boolean
  programType?: EntityType.Instance | EntityType.Program
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

        const domain = {
          message_id: ref,
          programType,
          type: target,
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
        type: domain.target,
      }),
    })
    const response = await query.json()
    return response
  }

  protected async parseDomains(
    domains: AddDomain[],
    throwOnCollision = true,
  ): Promise<AddDomain[]> {
    const currentDomains = await this.getAll()
    const currentDomainSet = new Set<string>(currentDomains.map((d) => d.name))

    if (!throwOnCollision) {
      domains = domains.filter((domain) => !currentDomainSet.has(domain.name))
    }

    return domains.map((domain: AddDomain) => {
      const ref = domain.ref.trim()
      const name = domain.name.trim()

      if (!ref || !isValidItemHash(ref)) throw new Error('Invalid domain ref')

      if (!name) throw new Error('Invalid domain name')

      if (throwOnCollision && currentDomainSet.has(name))
        throw new Error(`Domain name already used by another resource: ${name}`)

      return { ...domain, ref, name }
    })
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

    const domain: Domain = {
      type: EntityType.Domain,
      id: name,
      name,
      target: type,
      ref: message_id,
      confirmed: true,
    }

    // @note: legacy domains don't include programType (default to Instance)
    if (type === AddDomainTarget.Program) {
      domain.programType = content.programType || EntityType.Instance
    }

    return domain
  }
}
