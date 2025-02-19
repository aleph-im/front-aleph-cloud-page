import { Account } from '@aleph-sdk/account'
import { MessageCostLine, MessageType, StoreContent } from '@aleph-sdk/message'
import Err from '@/helpers/errors'
import {
  EntityType,
  PaymentMethod,
  VolumeType,
  defaultVolumeChannel,
  programStorageURL,
} from '@/helpers/constants'
import {
  downloadBlob,
  getDate,
  getExplorerURL,
  humanReadableSize,
} from '@/helpers/utils'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { FileManager } from './file'
import { EntityManager, EntityManagerFetchOptions } from './types'
import {
  newIsolatedVolumeSchema,
  newIsolatedVolumesSchema,
} from '@/helpers/schemas/volume'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { CostLine, CostSummary } from './cost'

export const mockVolumeRef =
  'cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe'

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
  estimated_size_mib?: number
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
  volume?: Volume | AddVolume
  paymentMethod?: PaymentMethod
}

export type VolumeCost = CostSummary

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

  constructor(
    protected account: Account,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected fileManager: FileManager,
    protected channel = defaultVolumeChannel,
  ) {}

  async getAll({
    ids,
    page,
    pagination,
    addresses = !ids ? [this.account.address] : undefined,
    channels = !ids ? [this.channel] : undefined,
  }: EntityManagerFetchOptions = {}): Promise<Volume[]> {
    try {
      const response = await this.sdkClient.getMessages({
        messageTypes: [MessageType.store],
        hashes: ids,
        addresses,
        channels,
        page,
        pagination,
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

  async getAddSteps(
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

  async *delSteps(
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

  async getCost(props: VolumeCostProps): Promise<VolumeCost> {
    let totalCost = Number.POSITIVE_INFINITY

    const { volume, paymentMethod = PaymentMethod.Hold } = props

    const emptyCost = {
      paymentMethod,
      cost: totalCost,
      lines: [],
    }

    if (!volume) return emptyCost

    const volumes = [volume]
    const [newVolume] = await this.parseNewVolumes(volumes)

    if (!newVolume || !newVolume.file) return emptyCost

    const costs = await this.sdkClient.storeClient.getEstimatedCost({
      account: this.account,
      fileObject: newVolume.file,
    })

    totalCost = Number(costs.cost)

    const lines = this.getCostLines(newVolume, paymentMethod, costs.detail)

    return {
      paymentMethod,
      cost: totalCost,
      lines,
    }
  }

  protected getCostLines(
    volume: AddNewVolume,
    paymentMethod: PaymentMethod,
    costDetailLines: MessageCostLine[],
  ): CostLine[] {
    return costDetailLines.map((line) => ({
      id: volume.file?.name || '',
      name: line.name,
      detail: volume?.file?.size
        ? humanReadableSize(volume.file.size)
        : 'Unknown size',
      cost:
        paymentMethod === PaymentMethod.Hold
          ? +line.cost_hold
          : +line.cost_stream,
    }))
  }
}
