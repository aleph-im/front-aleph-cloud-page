import { AnyMessage } from '@/helpers/utils'
import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { defaultConsoleChannel } from '@/helpers/constants'
import Err from '@/helpers/errors'

export class MessageManager {
  constructor(
    protected account: Account,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected channel = defaultConsoleChannel,
  ) {}

  /**
   * Returns an aleph program message for a given hash
   */
  async get(hash: string) {
    try {
      const msg = await this.sdkClient.getMessage(hash)

      return msg
    } catch (error) {
      throw Err.RequestFailed(error)
    }
  }

  /**
   * Deletes a VM using a forget message
   */
  async del(message: AnyMessage) {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      const msg = await this.sdkClient.forget({
        hashes: [message.item_hash],
        channel: message.channel,
      })

      return msg
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }
}
