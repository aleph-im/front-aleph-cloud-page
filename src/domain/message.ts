import { AnyMessage } from '@/helpers/utils'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { any, forget } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import { apiServer, defaultConsoleChannel } from '@/helpers/constants'

export class MessageManager {
  constructor(
    protected account: Account,
    protected channel = defaultConsoleChannel,
  ) {}

  /**
   * Returns an aleph program message for a given hash
   */
  async get(hash: string) {
    try {
      const msg = await any.GetMessage({
        hash: hash,
        APIServer: apiServer,
      })

      return msg
    } catch (error) {
      throw E_.RequestFailed(error)
    }
  }

  /**
   * Deletes a VM using a forget message
   */
  async del(message: AnyMessage) {
    try {
      const msg = await forget.Publish({
        account: this.account,
        hashes: [message.item_hash],
        channel: message.channel,
        APIServer: apiServer,
      })

      return msg
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }
}
