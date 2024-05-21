import { Account } from '@aleph-sdk/account'
import { MessageType, StoreContent } from '@aleph-sdk/message'
import Err from '@/helpers/errors'
import {
  EntityType,
  PaymentMethod,
  VolumeType,
  defaultVolumeChannel,
  programStorageURL,
} from '../helpers/constants'
import { downloadBlob, getDate, getExplorerURL } from '../helpers/utils'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { FileManager } from './file'
import { EntityManager } from './types'
import {
  newIsolatedVolumeSchema,
  newIsolatedVolumesSchema,
} from '@/helpers/schemas/volume'
import { StreamDurationField } from '@/hooks/form/useSelectStreamDuration'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'

export { VolumeType }

export type AddNewVolume = {
  volumeType: VolumeType.New
  file?: File
  mountPath?: string
  useLatest?: boolean
  size?: number
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
  paymentMethod?: PaymentMethod
  volumes?: (Volume | AddVolume | VolumeField)[]
  sizeDiscount?: number
  streamDuration?: StreamDurationField
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
  totalStreamCost: number
}

export class VolumeManager implements EntityManager<Volume, AddVolume> {
  static addSchema = newIsolatedVolumeSchema
  static addManySchema = newIsolatedVolumesSchema

  /**
   * Returns the size of a volume in mb
   */
  static async getVolumeSize(volume: Volume | AddVolume): Promise<number> {
    if (volume.volumeType === VolumeType.New) {
      return FileManager.getFileSize(volume?.file)
    }

    if (volume.volumeType === VolumeType.Existing) {
      return FileManager.getFileSize(volume.refHash)
    }

    return volume.size || 0
  }

  /**
   * Returns the size of a volume in mb
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getStorageVolumeMiBPrice(volume: Volume | AddVolume): number {
    // @todo: Right now we are not taking into account storage costs of the additional
    // volumes (they are considered included as part of the free storage tiers)
    return 0

    // if (volume.volumeType !== VolumeType.New) return 0
    // return 1 / 3
  }

  /**
   * Returns the size of a volume in mb
   */
  static getExecutionVolumeMiBPrice(
    volume: Volume | AddVolume,
    paymentMethod: PaymentMethod,
  ): number {
    return paymentMethod === PaymentMethod.Hold ? 1 / 20 : 0.001 / 1024
  }

  // @note: The algorithm for calculating the cost per volume is as follows:
  // 1. Calculate the storage allowance for the function, the more compute units, the more storage allowance
  // 2. For each volume, subtract the storage allowance from the volume size
  // 3. If there is more storage than allowance left, the additional storage is charged at ~20~ 1/3 tokens per mb
  static async getPerVolumeCost({
    volumes = [],
    sizeDiscount = 0,
    paymentMethod = PaymentMethod.Hold,
  }: VolumeCostProps): Promise<PerVolumeCost> {
    return Promise.all(
      volumes.map(async (volume) => {
        const size = await this.getVolumeSize(volume)
        const mibStoragePrice = this.getStorageVolumeMiBPrice(volume)
        const mibExecutionPrice = this.getExecutionVolumeMiBPrice(
          volume,
          paymentMethod,
        )

        if (size === Number.POSITIVE_INFINITY) {
          sizeDiscount = 0

          return {
            size,
            price: Number.POSITIVE_INFINITY,
            discount: 0,
            cost: Number.POSITIVE_INFINITY,
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
        const price = size * mibStoragePrice + size * mibExecutionPrice
        const cost = size * mibStoragePrice + newSize * mibExecutionPrice

        return {
          size,
          price,
          discount,
          cost,
        }
      }, [] as PerVolumeCost),
    )
  }

  static async getCost(props: VolumeCostProps): Promise<VolumeCost> {
    const perVolumeCost = await this.getPerVolumeCost(props)

    const totalCost = Object.values(perVolumeCost).reduce(
      (ac, cv) => ac + cv.cost,
      0,
    )

    // @todo: fix this
    const totalStreamCost = Number.POSITIVE_INFINITY

    return {
      perVolumeCost,
      totalCost,
      totalStreamCost,
    }
  }

  constructor(
    protected account: Account,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected fileManager: FileManager,
    protected channel = defaultVolumeChannel,
  ) {}

  async getAll(): Promise<Volume[]> {
    try {
      const response = await this.sdkClient.getMessages({
        addresses: [this.account.address],
        messageTypes: [MessageType.store],
        channels: [this.channel],
      })

      return await this.parseMessages(response.messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Volume | undefined> {
    const message = await this.sdkClient.getMessage(id)

    const [entity] = await this.parseMessages([message])
    return entity
  }

  async add(volumes: AddVolume | AddVolume[]): Promise<Volume[]> {
    const steps = this.addSteps(volumes)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(
    volumes: AddVolume | AddVolume[],
  ): AsyncGenerator<void, Volume[], void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    volumes = Array.isArray(volumes) ? volumes : [volumes]

    const newVolumes = await this.parseNewVolumes(volumes)
    if (newVolumes.length === 0) return []

    try {
      const { channel } = this

      // @note: Aggregate all signatures in 1 step
      yield
      const response = await Promise.all(
        newVolumes.map(async ({ file: fileObject }) =>
          (this.sdkClient as AuthenticatedAlephHttpClient).createStore({
            channel,
            fileObject,
            // fileHash: 'IPFS_HASH',
            // storageEngine: ItemType.ipfs,
          }),
        ),
      )

      return await this.parseMessages(response)
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async del(volumeOrId: string | Volume): Promise<void> {
    volumeOrId = typeof volumeOrId === 'string' ? volumeOrId : volumeOrId.id

    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      await this.sdkClient.forget({
        channel: this.channel,
        hashes: [volumeOrId],
      })
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async download(volumeOrId: string | Volume): Promise<void> {
    volumeOrId = typeof volumeOrId === 'string' ? volumeOrId : volumeOrId.id

    const req = await fetch(`${programStorageURL}${volumeOrId}`)
    const blob = await req.blob()

    return downloadBlob(blob, `Volume_${volumeOrId.slice(-12)}.sqsh`)
  }

  async getSteps(
    volumes: AddVolume | AddVolume[],
  ): Promise<CheckoutStepType[]> {
    volumes = Array.isArray(volumes) ? volumes : [volumes]
    const newVolumes = await this.parseNewVolumes(volumes)

    // @note: Aggregate all signatures in 1 step
    // return newVolumes.map(() => 'volume')
    return newVolumes.length ? ['volume'] : []
  }

  protected async parseNewVolumes(
    volumes: VolumeField[],
  ): Promise<Required<AddNewVolume>[]> {
    const newVolumes = volumes.filter(
      (volume: VolumeField): volume is Required<AddNewVolume> =>
        volume.volumeType === VolumeType.New && !!volume.file,
    )

    volumes = await VolumeManager.addManySchema.parseAsync(newVolumes)

    return newVolumes
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async parseMessages(messages: any[]): Promise<Volume[]> {
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

  async getDelSteps(
    volumesOrIds: string | Volume | (string | Volume)[],
  ): Promise<CheckoutStepType[]> {
    volumesOrIds = Array.isArray(volumesOrIds) ? volumesOrIds : [volumesOrIds]
    // @note: Aggregate all signatures in 1 step
    // return volumesOrIds.map(() => 'volumeDel')
    return volumesOrIds.length ? ['volumeDel'] : []
  }

  async *addDelSteps(
    volumesOrIds: string | Volume | (string | Volume)[],
  ): AsyncGenerator<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    volumesOrIds = Array.isArray(volumesOrIds) ? volumesOrIds : [volumesOrIds]
    if (volumesOrIds.length === 0) return

    try {
      // @note: Aggregate all signatures in 1 step
      yield
      await Promise.all(
        volumesOrIds.map(async (volumeOrId) => await this.del(volumeOrId)),
      )
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }
}
