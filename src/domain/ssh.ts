import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, post } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import {
  EntityType,
  apiServer,
  defaultSSHChannel,
  defaultSSHPostType,
} from '../helpers/constants'
import { getDate, getExplorerURL } from '../helpers/utils'
import { EntityManager } from './types'
import { sshKeySchema, sshKeysSchema } from '@/helpers/schemas/ssh'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'

export type AddSSHKey = {
  key: string
  label?: string
}

export type SSHKey = AddSSHKey & {
  type: EntityType.SSHKey
  id: string // hash
  url: string
  date: string
  confirmed?: boolean
}

export class SSHKeyManager implements EntityManager<SSHKey, AddSSHKey> {
  static addSchema = sshKeySchema
  static addManySchema = sshKeysSchema

  constructor(
    protected account: Account,
    protected type = defaultSSHPostType,
    protected channel = defaultSSHChannel,
  ) {}

  async getAll(): Promise<SSHKey[]> {
    try {
      const response = await post.Get({
        addresses: [this.account.address],
        types: [this.type],
        channels: [this.channel],
        APIServer: apiServer,
      })

      return this.parsePosts(response.posts)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<SSHKey | undefined> {
    const response = await post.Get({
      addresses: [this.account.address],
      types: [this.type],
      channels: [this.channel],
      hashes: [id],
      APIServer: apiServer,
    })

    const [entity] = this.parsePosts(response.posts)
    return entity
  }

  async getByValues(values: string[]): Promise<(SSHKey | undefined)[]> {
    const all = await this.getAll()
    return values.map((value) => all.find((d) => d.key === value))
  }

  async add(
    sshKeys: AddSSHKey | AddSSHKey[],
    throwOnCollision?: boolean,
  ): Promise<SSHKey[]> {
    const steps = this.addSteps(sshKeys, throwOnCollision)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(
    sshKeys: AddSSHKey | AddSSHKey[],
    throwOnCollision?: boolean,
  ): AsyncGenerator<void, SSHKey[], void> {
    sshKeys = Array.isArray(sshKeys) ? sshKeys : [sshKeys]

    sshKeys = await this.parseSSHKeys(sshKeys, throwOnCollision)
    if (sshKeys.length === 0) return []

    try {
      // @note: Aggregate all signatures in 1 step
      yield
      const response = await Promise.all(
        sshKeys.map(({ key, label }) =>
          post.Publish({
            account: this.account,
            postType: this.type,
            channel: this.channel,
            content: { key, label },
            APIServer: apiServer,
          }),
        ),
      )

      return this.parseNewPosts(response)
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(sshKeyOrId: string | SSHKey): Promise<void> {
    sshKeyOrId = typeof sshKeyOrId === 'string' ? sshKeyOrId : sshKeyOrId.id

    try {
      await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [sshKeyOrId],
        APIServer: apiServer,
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async getSteps(
    sshKeys: AddSSHKey | AddSSHKey[],
    throwOnCollision?: boolean,
  ): Promise<CheckoutStepType[]> {
    sshKeys = Array.isArray(sshKeys) ? sshKeys : [sshKeys]
    sshKeys = await this.parseSSHKeys(sshKeys, throwOnCollision)

    // @note: Aggregate all signatures in 1 step
    // return sshKeys.map(() => 'ssh')
    return sshKeys.length ? ['ssh'] : []
  }

  protected async parseSSHKeys(
    sshKeys: AddSSHKey[],
    throwOnCollision = true,
  ): Promise<AddSSHKey[]> {
    sshKeys = await SSHKeyManager.addManySchema.parseAsync(sshKeys)

    const currentSSHKeys = await this.getAll()
    const currentSSHKeySet = new Set<string>(currentSSHKeys.map((d) => d.key))

    if (!throwOnCollision) {
      return sshKeys.filter((sshKey) => !currentSSHKeySet.has(sshKey.key))
    } else {
      return sshKeys.map((sshKey: AddSSHKey) => {
        if (!currentSSHKeySet.has(sshKey.key)) return sshKey
        throw new Error(
          `SSH key already exists on your collection: ${
            sshKey.label || sshKey.key
          }`,
        )
      })
    }
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parsePosts(posts: any[]): SSHKey[] {
    return posts.map((post) => this.parsePost(post, post.content))
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseNewPosts(posts: any[]): SSHKey[] {
    return posts.map((post) => this.parsePost(post, post.content.content))
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parseNewPost(post: any): SSHKey {
    return this.parsePost(post, post.content.content)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parsePost(post: any, content: any): SSHKey {
    return {
      type: EntityType.SSHKey,
      id: post.item_hash,
      ...content,
      url: getExplorerURL(post),
      date: getDate(post.time),
      confirmed: !!post.confirmed,
    }
  }
}
