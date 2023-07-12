import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { aggregate } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import {
  EntityType,
  defaultDomainAggregateKey,
  defaultDomainChannel,
} from '../helpers/constants'
import { EntityManager } from './types'

export type DomainAggregateItem = {
  type: AddDomainTarget
  message_id: string
}

export type DomainAggregate = Record<string, DomainAggregateItem | null>

export enum AddDomainTarget {
  IPFS = 'ipfs',
  Program = 'program',
}

export type AddDomain = {
  name: string
  target: AddDomainTarget
  ref: string
}

export type Domain = AddDomain & {
  type: EntityType.Domain
  id: string
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

  async add(domains: AddDomain | AddDomain[]): Promise<Domain[]> {
    domains = Array.isArray(domains) ? domains : [domains]

    try {
      const content: DomainAggregate = domains.reduce((ac, cv) => {
        const { name, ref, target } = cv

        ac[name] = {
          message_id: ref,
          type: target,
        }

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
    { message_id, type }: DomainAggregateItem,
  ): Domain {
    return {
      type: EntityType.Domain,
      id: name,
      name,
      target: type,
      ref: message_id,
      confirmed: true,
    }
  }
}
