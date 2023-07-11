import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, post } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import {
  EntityType,
  defaultSSHChannel,
  defaultSSHPostType,
} from '../helpers/constants'
import { getDate, getExplorerURL } from '../helpers/utils'

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

export class SSHKeyManager {
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
    })

    const [entity] = this.parsePosts(response.posts)
    return entity
  }

  async add(sshKey: AddSSHKey): Promise<SSHKey> {
    try {
      const { key, label } = sshKey

      const response = await post.Publish({
        account: this.account,
        postType: this.type,
        channel: this.channel,
        content: { key, label },
      })

      return this.parseNewPost(response)
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(sshKeyOrId: string | SSHKey) {
    sshKeyOrId = typeof sshKeyOrId === 'string' ? sshKeyOrId : sshKeyOrId.id

    try {
      return await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [sshKeyOrId],
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parsePosts(posts: any[]): SSHKey[] {
    return posts.map((post) => this.parsePost(post, post.content))
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
