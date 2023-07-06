import { defaultConsoleChannel } from '@/helpers/constants'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'

export type AccountFileObject = {
  file_hash: string
  size: number
  type: 'file'
  created: string
  item_hash: string
}
export type AccountFilesResponse = {
  address: string
  total_size: number
  files: AccountFileObject[]
}

export class FileManager {
  protected sizesMapCache: Record<string, number> = {}
  protected lastFetch = 0

  constructor(
    protected account: Account,
    protected channel = defaultConsoleChannel,
  ) {}

  async getAll(): Promise<AccountFilesResponse> {
    const { address } = this.account

    const emptyPayload = {
      address,
      total_size: 0,
      files: [],
    }

    try {
      const query = await fetch(
        `https://api2.aleph.im/api/v0/addresses/${address}/files`,
      )
      const response = ((await query.json()) ||
        emptyPayload) as AccountFilesResponse

      this.parseSizesMap(response.files)

      return response
    } catch (e) {
      console.error(e)
      return emptyPayload
    }
  }

  async getSizesMap(): Promise<Record<string, number>> {
    if (this.lastFetch + 1000 * 60 < Date.now()) {
      await this.getAll()
    }

    return this.sizesMapCache
  }

  protected parseSizesMap(files: AccountFileObject[]): void {
    this.lastFetch = Date.now()
    this.sizesMapCache = files.reduce((ac, cv) => {
      ac[cv.item_hash] = cv.size
      return ac
    }, {} as Record<string, number>)
  }
}
