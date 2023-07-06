import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, store, any } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import {
  EntityType,
  defaultVolumeChannel,
  programStorageURL,
} from '../helpers/constants'
import { downloadBlob, getDate, getExplorerURL } from '../helpers/utils'
import {
  MessageType,
  StoreContent,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/types'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import { FileManager } from './file'

export enum VolumeType {
  New = 'new',
  Existing = 'existing',
  Persistent = 'persistent',
}

export type AddNewVolume = {
  id: string
  volumeType: VolumeType.New
  fileSrc?: File
}

export type AddExistingVolume = {
  id: string
  volumeType: VolumeType.Existing
  mountPath: string
  refHash: string
  useLatest: boolean
  size?: number
}

export type AddPersistentVolume = {
  id: string
  volumeType: VolumeType.Persistent
  name: string
  mountPath: string
  size: number
}

// ---------------

export type AddVolume = AddNewVolume | AddExistingVolume | AddPersistentVolume

export type BaseVolume = StoreContent & {
  url: string
  date: string
  size?: number
}

export type NewVolume = BaseVolume & {
  type: EntityType.Volume
  id: string
  volumeType: VolumeType.New
  fileSrc?: File
  mountPath: string
  useLatest: boolean
  size?: number
}

export type ExistingVolume = BaseVolume & {
  type: EntityType.Volume
  id: string
  volumeType: VolumeType.Existing
  mountPath: string
  refHash: string
  useLatest: boolean
  size?: number
}

export type PersistentVolume = BaseVolume & {
  type: EntityType.Volume
  id: string
  volumeType: VolumeType.Persistent
  name: string
  mountPath: string
  size: number
}

export type Volume = NewVolume | ExistingVolume | PersistentVolume

export class VolumeManager {
  /**
   * Returns the size of a volume in mb
   */
  static getVolumeSize(volume: Volume | AddVolume): number {
    if (volume.volumeType === VolumeType.New) {
      return (volume?.fileSrc?.size || 0) / 10 ** 6
    }

    return volume.size || 0
  }

  static getVolumeCost(volume: Volume): number {
    return this.getVolumeSize(volume) * 20
  }

  // @note: The algorithm for calculating the cost per volume is as follows:
  // 1. Calculate the storage allowance for the function, the more compute units, the more storage allowance
  // 2. For each volume, subtract the storage allowance from the volume size
  // 3. If there is more storage than allowance left, the additional storage is charged at 20 tokens per mb
  static getPerVolumeCost(
    volumes: (Volume | AddVolume)[],
    storageAllowance = 0,
  ): number[] {
    return volumes.map((volume) => {
      let size = this.getVolumeSize(volume) || 0

      if (storageAllowance > 0) {
        if (size <= storageAllowance) {
          storageAllowance -= size
          size = 0
        } else {
          size -= storageAllowance
          storageAllowance = 0
        }
      }

      return size * 20
    })
  }

  static getVolumeTotalCost(
    volumes: (Volume | AddVolume)[],
    storageAllowance = 0,
  ): number {
    return this.getPerVolumeCost(volumes, storageAllowance).reduce(
      (ac, cv) => ac + cv,
      0,
    )
  }

  constructor(
    protected account: Account,
    protected channel = defaultVolumeChannel,
    protected fileManager = new FileManager(account),
  ) {}

  async getAll(): Promise<Volume[]> {
    try {
      const response = await any.GetMessages({
        addresses: [this.account.address],
        messageType: MessageType.store,
        channels: [this.channel],
      })

      return this.parseMessages(response.messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Volume | undefined> {
    const message = await any.GetMessage({
      hash: id,
      messageType: MessageType.store,
      channel: this.channel,
    })

    const [data] = await this.parseMessages([message])
    return data
  }

  async add(volumes: AddVolume | AddVolume[]): Promise<StoreMessage[]> {
    volumes = Array.isArray(volumes) ? volumes : [volumes]

    const newVolumes = this.parseNewVolumes(volumes)

    try {
      const { account, channel } = this

      return await Promise.all(
        newVolumes.map(async ({ fileSrc: fileObject }) =>
          store.Publish({
            account,
            channel,
            fileObject,
          }),
        ),
      )
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(volumeOrId: string | Volume) {
    volumeOrId = typeof volumeOrId === 'string' ? volumeOrId : volumeOrId.id

    try {
      return await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [volumeOrId],
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async download(volumeOrId: string | Volume): Promise<void> {
    volumeOrId = typeof volumeOrId === 'string' ? volumeOrId : volumeOrId.id

    const req = await fetch(`${programStorageURL}${volumeOrId}`)
    const blob = await req.blob()

    return downloadBlob(blob, `Volume_${volumeOrId.slice(-12)}.sqsh`)
  }

  protected parseNewVolumes(
    volumes: VolumeProp | VolumeProp[],
  ): Required<AddNewVolume>[] {
    volumes = Array.isArray(volumes) ? volumes : [volumes]

    return volumes.filter(
      (volume: VolumeProp): volume is Required<AddNewVolume> =>
        volume.volumeType === VolumeType.New && !!volume.fileSrc,
    )
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async parseMessages(messages: any[]): Promise<Volume[]> {
    const sizesMap = await this.fileManager.getSizesMap()

    return messages
      .filter(({ content }) => content !== undefined)
      .map((message) => {
        return {
          id: message.item_hash,
          ...message.content,
          type: EntityType.Volume,
          volumeType: VolumeType.Existing,
          url: getExplorerURL(message),
          date: getDate(message.time),
          size: sizesMap[message.item_hash],
        }
      })
  }
}
