import { defaultConsoleChannel } from '@/helpers/constants'
import { addIPFSPinSchema } from '@/helpers/schemas'
import { Mutex, convertByteUnits } from '@/helpers/utils'
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
  protected mutex = new Mutex()

  static addSchema = addIPFSPinSchema

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
    const release = await this.mutex.acquire()

    try {
      if (this.lastFetch + 1000 * 60 < Date.now()) {
        await this.getAll()
      }
    } finally {
      release()
    }

    return this.sizesMapCache
  }

  async add(file: File): Promise<AccountFileObject> {}

  protected parseSizesMap(files: AccountFileObject[]): void {
    this.lastFetch = Date.now()
    this.sizesMapCache = files.reduce((ac, cv) => {
      // @note: Cast from bytes to MiB
      ac[cv.item_hash] = convertByteUnits(cv.size, { from: 'B', to: 'MiB' })
      return ac
    }, {} as Record<string, number>)
  }
}
