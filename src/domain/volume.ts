import { Account } from '@aleph-sdk/account'
import {
  ItemType,
  MessageCostLine,
  MessageType,
  Payment,
  PaymentType,
  StoreContent,
} from '@aleph-sdk/message'
import Err from '@/helpers/errors'
import {
  EntityType,
  PaymentMethod,
  VolumeType,
  VolumeUploadMode,
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
import { mockAccount } from './account'
import { Blockchain } from '@aleph-sdk/core'

export const mockVolumeRef =
  'cafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe'
export const mockVolumeMountPath = '/mocked-mount-path'
export const mockVolumeName = 'mock-name'

export { VolumeType }

export type AddNewVolume = {
  volumeType: VolumeType.New
  uploadMode?: VolumeUploadMode
  file?: File
  cid?: string
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
  uploadMode?: VolumeUploadMode
  file?: File
  cid?: string
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

  static async getEstimatedVolumeSize(
    volume: Volume | AddVolume,
  ): Promise<number> {
    const size = await this.getVolumeSize(volume)
    return Math.ceil(size)
  }

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected fileManager: FileManager,
    protected channel = defaultVolumeChannel,
  ) {}

  async getAll({
    ids,
    page,
    pagination,
    addresses = !ids && this.account ? [this.account.address] : undefined,
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

    // Separate file-based and IPFS-based volumes
    const fileVolumes = await this.parseNewVolumes(volumes)
    const ipfsVolumes = this.parseIPFSVolumes(volumes)

    if (fileVolumes.length === 0 && ipfsVolumes.length === 0) return []

    try {
      const { channel } = this

      // Hardcode credit payment as the only valid payment method
      const creditPayment: Payment = {
        chain: Blockchain.ETH,
        type: PaymentType.credit,
      }

      // @note: Aggregate all signatures in 1 step
      yield
      const response = await Promise.all([
        // File-based volumes (existing behavior)
        ...fileVolumes.map(async ({ file: fileObject }) =>
          (this.sdkClient as AuthenticatedAlephHttpClient).createStore({
            channel,
            fileObject,
            payment: creditPayment,
          }),
        ),
        // IPFS-based volumes (pinning via STORE message)
        ...ipfsVolumes.map(async ({ cid }) =>
          (this.sdkClient as AuthenticatedAlephHttpClient).createStore({
            channel,
            fileHash: cid,
            storageEngine: ItemType.ipfs,
            payment: creditPayment,
          }),
        ),
      ])

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
    const volumeId =
      typeof volumeOrId === 'string'
        ? volumeOrId
        : volumeOrId.item_type === 'ipfs'
          ? volumeOrId.id
          : volumeOrId.item_hash

    const filename =
      typeof volumeOrId !== 'string' && 'filename' in volumeOrId
        ? String(volumeOrId.filename)
        : `Volume_${volumeId.slice(-12)}.sqsh`

    const req = await fetch(`${programStorageURL}${volumeId}`)
    const blob = await req.blob()

    return downloadBlob(blob, filename)
  }

  async getAddSteps(
    volumes: AddVolume | AddVolume[],
  ): Promise<CheckoutStepType[]> {
    volumes = Array.isArray(volumes) ? volumes : [volumes]
    const newVolumes = await this.parseNewVolumes(volumes)
    const ipfsVolumes = this.parseIPFSVolumes(volumes)

    // @note: Aggregate all signatures in 1 step
    return newVolumes.length > 0 || ipfsVolumes.length > 0 ? ['volume'] : []
  }

  protected async parseNewVolumes(
    volumes: VolumeField[],
  ): Promise<Required<AddNewVolume>[]> {
    const newVolumes = volumes.filter(
      (volume: VolumeField): volume is Required<AddNewVolume> =>
        volume.volumeType === VolumeType.New &&
        volume.uploadMode !== VolumeUploadMode.IPFS &&
        !!volume.file,
    )

    volumes = await VolumeManager.addManySchema.parseAsync(newVolumes)

    return newVolumes
  }

  protected parseIPFSVolumes(volumes: VolumeField[]): { cid: string }[] {
    return volumes
      .filter(
        (v): v is AddNewVolume =>
          v.volumeType === VolumeType.New &&
          v.uploadMode === VolumeUploadMode.IPFS &&
          !!v.cid,
      )
      .map(({ cid }) => ({ cid: cid as string }))
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

    const { volume, paymentMethod = PaymentMethod.Credit } = props

    const emptyCost = {
      paymentMethod,
      cost: totalCost,
      lines: [],
    }

    if (!volume) return emptyCost

    const { account = mockAccount } = this

    const sdkPaymentType =
      paymentMethod === PaymentMethod.Credit
        ? PaymentType.credit
        : PaymentType.hold

    // Handle IPFS upload mode
    if (volume.volumeType === VolumeType.New) {
      const newVolume = volume as AddNewVolume
      if (newVolume.uploadMode === VolumeUploadMode.IPFS && newVolume.file) {
        const costs = await this.sdkClient.storeClient.getEstimatedCost({
          account,
          fileObject: newVolume.file,
          payment: { chain: Blockchain.ETH, type: sdkPaymentType },
        })

        return {
          paymentMethod,
          cost: this.parseCost(paymentMethod, Number(costs.cost)),
          lines: this.getIPFSCostLines(
            newVolume.file,
            paymentMethod,
            costs.detail,
          ),
        }
      }
    }

    // Handle file-based volume
    const volumes = [volume]
    const [newVolume] = await this.parseNewVolumes(volumes)

    if (!newVolume || !newVolume.file) return emptyCost

    const costs = await this.sdkClient.storeClient.getEstimatedCost({
      account,
      fileObject: newVolume.file,
      payment: { chain: Blockchain.ETH, type: sdkPaymentType },
    })

    totalCost = this.parseCost(paymentMethod, Number(costs.cost))

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
      cost: this.parseCost(
        paymentMethod,
        paymentMethod === PaymentMethod.Hold
          ? +line.cost_hold
          : paymentMethod === PaymentMethod.Stream
            ? +line.cost_stream
            : +line.cost_credit,
      ),
    }))
  }

  protected getIPFSCostLines(
    file: File,
    paymentMethod: PaymentMethod,
    costDetailLines: MessageCostLine[],
  ): CostLine[] {
    return costDetailLines.map((line) => ({
      id: file.name || 'IPFS Upload',
      name: line.name,
      detail: humanReadableSize(file.size),
      cost: this.parseCost(
        paymentMethod,
        paymentMethod === PaymentMethod.Hold
          ? +line.cost_hold
          : paymentMethod === PaymentMethod.Stream
            ? +line.cost_stream
            : +line.cost_credit,
      ),
    }))
  }

  // API returns cost in credits/sec, convert to credits/hour for credit payments
  protected parseCost(paymentMethod: PaymentMethod, cost: number): number {
    return paymentMethod === PaymentMethod.Hold ? cost : cost * 3600
  }
}
