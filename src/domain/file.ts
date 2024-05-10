import { apiServer, channel, defaultConsoleChannel } from '@/helpers/constants'
import { Mutex, convertByteUnits } from '@/helpers/utils'
import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { ItemType, MessageType, StoreMessage } from '@aleph-sdk/message'
import Err from '@/helpers/errors'

export type FileObject = {
  created: string
  file_hash: string
  item_hash: string
  size: number
  type: 'file'
}

export type FilesInfo<
  F extends StoreMessage | FileObject = StoreMessage | FileObject,
> = {
  files: F[]
  totalSize: number
}

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
      // @todo: refactor
      const client = new AlephHttpClient(apiServer)
      const message = await client.getMessage(hashOrFile)

      const { item_type, item_hash } = message.content as any

      if (item_type === ItemType.ipfs || item_type === ItemType.storage) {
        const query = await fetch(
          `${apiServer}/api/v0/storage/raw/${item_hash}`,
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

  static async getFolderSize(hash?: string): Promise<number>
  static async getFolderSize(folder?: FileList): Promise<number>
  static async getFolderSize(
    folderOrFile?: string | FileList,
  ): Promise<number> {
    if (!folderOrFile) return Number.POSITIVE_INFINITY

    if (folderOrFile instanceof FileList) {
      let totalSize = 0
      Array.from(folderOrFile).forEach((file) => {
        const size = file?.size
        if (size === undefined) return Number.POSITIVE_INFINITY
        totalSize += convertByteUnits(file.size, { from: 'B', to: 'MiB' })
      })
      return totalSize
    }

    try {
      const client = new AlephHttpClient(apiServer)
      const message = await client.getMessage(folderOrFile)

      const { item_type, item_hash } = message.content as any

      if (item_type === ItemType.ipfs || item_type === ItemType.storage) {
        const query = await fetch(
          `${apiServer}/api/v0/storage/raw/${item_hash}`,
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
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected account?: Account,
    protected channel = defaultConsoleChannel,
  ) {}

  async getAll(): Promise<AccountFilesResponse> {
    if (!this.account) throw Err.InvalidAccount

    const { address } = this.account

    const emptyPayload = {
      address,
      total_size: 0,
      files: [],
    }

    try {
      const query = await fetch(
        `${apiServer}/api/v0/addresses/${address}/files`,
      )
      if (!query.ok) return emptyPayload
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
    if (!this.account) throw Err.InvalidAccount

    // @note: Quick temporal fix to upload files
    const buffer = Buffer.from(await fileObject.arrayBuffer())

    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    const message = await this.sdkClient.createStore({
      channel,
      fileObject: buffer,
    })

    return message.content.item_hash
  }

  static async uploadFolder(folder: FileList): Promise<string | undefined> {
    const data = new FormData()
    Array.from(folder).forEach((f) => data.append('file', f))
    const query = await fetch(
      'https://ipfs.aleph.cloud/api/v0/add?to-files=1',
      {
        method: 'POST',
        body: data,
      },
    )
    if (query.status === 200)
      return JSON.parse((await query.text()).split('\n').at(-2) ?? '{}')['Hash']
  }

  protected parseSizesMap(files: AccountFileObject[]): void {
    this.lastFetch = Date.now()
    this.sizesMapCache = files.reduce(
      (ac, cv) => {
        // @note: Cast from bytes to MiB
        ac[cv.item_hash] = convertByteUnits(cv.size, { from: 'B', to: 'MiB' })
        return ac
      },
      {} as Record<string, number>,
    )
  }

  // -------------------------------------------------
  // @todo: Refactor (copied from account page)
  // -------------------------------------------------

  async getFiles(): Promise<FilesInfo<StoreMessage> | undefined> {
    const [messages, objects] = await Promise.all([
      this.getFileMessages(),
      this.getFileObjects(),
    ])

    let totalSize = objects?.totalSize || messages?.totalSize
    if (totalSize === undefined) return

    const oFiles = objects?.files || []
    const entries = oFiles.map((file) => [file.item_hash, file]) as [
      string,
      FileObject,
    ][]
    const objsMap = new Map<string, FileObject>(entries)

    const mFiles = messages?.files || []
    const files = [...mFiles].map((file) => {
      const newFile = { ...file }
      newFile.content.size = objsMap.get(file.item_hash)?.size || 0
      return newFile
    }) as StoreMessage[]

    totalSize =
      files.reduce((ac, cv) => ac + (cv?.content?.size || 0), 0) / 1024 ** 2

    return {
      files,
      totalSize,
    }
  }

  protected async getFileMessages(): Promise<
    FilesInfo<StoreMessage> | undefined
  > {
    if (!this.account) return

    const { address } = this.account

    const items = await this.sdkClient.getMessages({
      messageTypes: [MessageType.store],
      addresses: [address],
      pageSize: 1000,
    })

    const files = (items?.messages || []) as StoreMessage[]
    const totalSize = files.reduce((ac, cv) => ac + (cv?.content?.size || 0), 0)

    return {
      files,
      totalSize,
    }
  }

  protected async getFileObjects(): Promise<FilesInfo<FileObject> | undefined> {
    if (!this.account) return

    const { address } = this.account

    try {
      // Postgres API
      const res = await fetch(
        `${apiServer}/api/v0/addresses/${address}/files?pagination=1000`,
      )

      const content = await res.json()
      const totalSize = content.total_size / 1024 ** 2
      const files = content.files

      return { files, totalSize }
    } catch (error) {
      console.log('Files API is not yet implemented on the node')
    }
  }
}
