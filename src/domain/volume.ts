import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, store, any } from 'aleph-sdk-ts/dist/messages'
import E_ from '../helpers/errors'
import {
  EntityType,
  VolumeType,
  defaultVolumeChannel,
  programStorageURL,
} from '../helpers/constants'
import { downloadBlob, getDate, getExplorerURL } from '../helpers/utils'
import { MessageType, StoreContent } from 'aleph-sdk-ts/dist/messages/types'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { FileManager } from './file'
import { EntityManager } from './types'
import {
  newIsolatedVolumeSchema,
  newIsolatedVolumesSchema,
} from '@/helpers/schemas'

export { VolumeType }

export type AddNewVolume = {
  volumeType: VolumeType.New
  file?: File
}

export type AddExistingVolume = {
  volumeType: VolumeType.Existing
  mountPath: string
  refHash: string
  useLatest: boolean
  size?: number
}

export type AddPersistentVolume = {
  volumeType: VolumeType.Persistent
  name: string
  mountPath: string
  size: number
}

// ---------------

export type AddVolume = AddNewVolume | AddExistingVolume | AddPersistentVolume

export type BaseVolume = StoreContent & {
  id: string
  url: string
  date: string
  size?: number
  confirmed?: boolean
}

export type NewVolume = BaseVolume & {
  type: EntityType.Volume
  volumeType: VolumeType.New
  file?: File
  mountPath: string
  useLatest: boolean
  size?: number
}

export type ExistingVolume = BaseVolume & {
  type: EntityType.Volume
  volumeType: VolumeType.Existing
  mountPath: string
  refHash: string
  useLatest: boolean
  size?: number
}

export type PersistentVolume = BaseVolume & {
  type: EntityType.Volume
  volumeType: VolumeType.Persistent
  name: string
  mountPath: string
  size: number
}

export type Volume = NewVolume | ExistingVolume | PersistentVolume

export type VolumeCostProps = {
  volumes?: (Volume | AddVolume)[]
  sizeDiscount?: number
  exclude?: VolumeType[]
}

export type PerVolumeCostItem = {
  size: number
  price: number
  discount: number
  cost: number
}

export type PerVolumeCost = PerVolumeCostItem[]

export type VolumeCost = {
  perVolumeCost: PerVolumeCost
  totalCost: number
}

export class VolumeManager implements EntityManager<Volume, AddVolume> {
  static addSchema = newIsolatedVolumeSchema
  static addManySchema = newIsolatedVolumesSchema

  /**
   * Returns the size of a volume in mb
   */
  static getVolumeSize(volume: Volume | AddVolume): number {
    if (volume.volumeType === VolumeType.New) {
      return (volume?.file?.size || 0) / 10 ** 6
    }

    return volume.size || 0
  }

  // @note: The algorithm for calculating the cost per volume is as follows:
  // 1. Calculate the storage allowance for the function, the more compute units, the more storage allowance
  // 2. For each volume, subtract the storage allowance from the volume size
  // 3. If there is more storage than allowance left, the additional storage is charged at ~20~ 1/3 tokens per mb
  static getPerVolumeCost({
    volumes = [],
    sizeDiscount = 0,
    exclude = [VolumeType.Existing],
  }: VolumeCostProps): PerVolumeCost {
    return volumes.map((volume) => {
      const isExcluded = exclude.includes(volume.volumeType)
      const size = this.getVolumeSize(volume) || 0

      if (isExcluded) {
        return {
          size,
          price: 0,
          discount: 0,
          cost: 0,
        }
      }

      let newSize = size

      if (sizeDiscount > 0) {
        if (newSize <= sizeDiscount) {
          sizeDiscount -= newSize
          newSize = 0
        } else {
          newSize -= sizeDiscount
          sizeDiscount = 0
        }
      }

      // @todo: Check extra price calculation (on the medium article it is 20ALEPH per 1MB / scheduler code checks 1/3ALEPH per 1MB)
      // @note: medium article =>  https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
      // @note: code is law => https://github.com/aleph-im/aleph-vm-scheduler/blob/master/scheduler/balance.py#L82
      // const cost = newSize * 20
      const discount = size > 0 ? 1 - newSize / size : 0
      const price = size * (1 / 3)
      const cost = newSize * (1 / 3)

      return {
        size,
        price,
        discount,
        cost,
      }
    }, [] as PerVolumeCost)
  }

  static getCost(props: VolumeCostProps): VolumeCost {
    const perVolumeCost = this.getPerVolumeCost(props)

    const totalCost = Math.ceil(
      Object.values(perVolumeCost).reduce((ac, cv) => ac + cv.cost, 0),
    )

    return {
      perVolumeCost,
      totalCost,
    }
  }

  constructor(
    protected account: Account,
    protected fileManager: FileManager,
    protected channel = defaultVolumeChannel,
  ) {}

  async getAll(): Promise<Volume[]> {
    try {
      const response = await any.GetMessages({
        addresses: [this.account.address],
        messageType: MessageType.store,
        channels: [this.channel],
      })

      return await this.parseMessages(response.messages)
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

    const [entity] = await this.parseMessages([message])
    return entity
  }

  async add(volumes: AddVolume | AddVolume[]): Promise<Volume[]> {
    volumes = Array.isArray(volumes) ? volumes : [volumes]

    const newVolumes = this.parseNewVolumes(volumes)
    if (newVolumes.length === 0) return []

    try {
      const { account, channel } = this

      const response = await Promise.all(
        newVolumes.map(async ({ file: fileObject }) =>
          store.Publish({
            account,
            channel,
            fileObject,
          }),
        ),
      )

      return await this.parseMessages(response)
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(volumeOrId: string | Volume): Promise<void> {
    volumeOrId = typeof volumeOrId === 'string' ? volumeOrId : volumeOrId.id

    try {
      await forget.Publish({
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

  protected parseNewVolumes(volumes: VolumeField[]): Required<AddNewVolume>[] {
    volumes = VolumeManager.addManySchema.parse(volumes)

    const newVolumes = volumes.filter(
      (volume: VolumeField): volume is Required<AddNewVolume> =>
        volume.volumeType === VolumeType.New && !!volume.file,
    )

    return newVolumes
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async parseMessages(messages: any[]): Promise<Volume[]> {
    const sizesMap = await this.fileManager.getSizesMap()

    return messages
      .filter(({ content }) => content !== undefined)
      .map((message) => this.parseMessage(message, message.content, sizesMap))
  }

  protected parseMessage(
    message: any,
    content: any,
    sizesMap: Record<string, number>,
  ): Volume {
    return {
      id: message.item_hash,
      ...content,
      type: EntityType.Volume,
      volumeType: VolumeType.Existing,
      url: getExplorerURL(message),
      date: getDate(message.time),
      size: sizesMap[message.item_hash],
      confirmed: !!message.confirmed,
    }
  }
}
