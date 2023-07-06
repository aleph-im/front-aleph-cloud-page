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

    const [data] = this.parsePosts(response.posts)
    return data
  }

  async add(sshKey: AddSSHKey) {
    try {
      const { key, label } = sshKey

      return await post.Publish({
        account: this.account,
        postType: this.type,
        channel: this.channel,
        content: { key, label },
      })
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
    return posts.map((post) => {
      return {
        type: EntityType.SSHKey,
        id: post.item_hash,
        ...post.content,
        url: getExplorerURL(post),
        date: getDate(post.time),
      }
    })
  }
}
