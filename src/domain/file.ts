import { apiServer, channel, defaultConsoleChannel } from '@/helpers/constants'
import { Mutex, convertByteUnits } from '@/helpers/utils'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { any, store } from 'aleph-sdk-ts/dist/messages'
import { ItemType } from 'aleph-sdk-ts/dist/messages/types'

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

  static async getFileSize(hash?: string): Promise<number>
  static async getFileSize(file?: File): Promise<number>
  static async getFileSize(hashOrFile?: string | File): Promise<number> {
    if (!hashOrFile) return Number.POSITIVE_INFINITY

    if (hashOrFile instanceof File) {
      const size = hashOrFile?.size
      if (size === undefined) return Number.POSITIVE_INFINITY
      return convertByteUnits(size, { from: 'B', to: 'MiB' })
    }

    try {
      const message = await any.GetMessage({ hash: hashOrFile })
      console.log(message.content)
      const { item_type, item_hash } = message.content as any

      if (item_type === ItemType.ipfs || item_type === ItemType.storage) {
        const query = await fetch(
          `https://api2.aleph.im/api/v0/storage/raw/${item_hash}`,
          { method: 'HEAD' },
        )

        const contentLength = query.headers.get('Content-Length')
        if (!contentLength) return Number.POSITIVE_INFINITY

        return convertByteUnits(Number(contentLength), {
          from: 'B',
          to: 'MiB',
        })
      }
    } catch {}

    return Number.POSITIVE_INFINITY
  }

  constructor(
    protected account?: Account,
    protected channel = defaultConsoleChannel,
  ) {}

  async getAll(): Promise<AccountFilesResponse> {
    if (!this.account) throw new Error('Invalid account')

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

  async uploadFile(fileObject: File): Promise<string> {
    if (!this.account) throw new Error('Invalid account')

    // @note: Quick temporal fix to upload files
    const buffer = Buffer.from(await fileObject.arrayBuffer())

    const message = await store.Publish({
      account: this.account,
      channel,
      APIServer: apiServer,
      fileObject: buffer,
    })

    return message.content.item_hash
  }

  protected parseSizesMap(files: AccountFileObject[]): void {
    this.lastFetch = Date.now()
    this.sizesMapCache = files.reduce((ac, cv) => {
      // @note: Cast from bytes to MiB
      ac[cv.item_hash] = convertByteUnits(cv.size, { from: 'B', to: 'MiB' })
      return ac
    }, {} as Record<string, number>)
  }
}
