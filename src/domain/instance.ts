import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { any, forget, instance } from 'aleph-sdk-ts/dist/messages'
import { InstancePublishConfiguration } from 'aleph-sdk-ts/dist/messages/instance/publish'
import { InstanceContent, MachineVolume, MessageType, PaymentType } from 'aleph-sdk-ts/dist/messages/types'
import E_ from '../helpers/errors'
import { apiServer, defaultInstanceChannel, EntityType, PaymentMethod } from '../helpers/constants'
import { getDate, getExplorerURL } from '../helpers/utils'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import {
  Executable,
  ExecutableCost,
  ExecutableCostProps,
  PaymentConfiguration,
  StreamPaymentConfiguration,
} from './executable'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { InstanceImageField } from '@/hooks/form/useSelectInstanceImage'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { DomainManager } from './domain'
import { EntityManager } from './types'
import { instanceSchema, instanceStreamSchema } from '@/helpers/schemas/instance'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { Web3Provider } from '@ethersproject/providers'
import { superfluid } from 'aleph-sdk-ts/dist/accounts'
import { getHours } from '@/hooks/form/useSelectStreamDuration'

export type AddInstance = Omit<
  InstancePublishConfiguration,
  'image' | 'account' | 'channel' | 'authorized_keys' | 'resources' | 'volumes' | 'payment'
> &
  NameAndTagsField & {
    image: InstanceImageField
    specs: InstanceSpecsField
    sshKeys: SSHKeyField[]
    volumes?: VolumeField[]
    envVars?: EnvVarField[]
    domains?: Omit<DomainField, 'ref'>[]
    payment?: PaymentConfiguration
  }

// @todo: Refactor
export type Instance = InstanceContent & {
  type: EntityType.Instance
  id: string // hash
  url: string
  date: string
  size?: number
  confirmed?: boolean
}

export type InstanceCostProps = Omit<ExecutableCostProps, 'type'>

export type InstanceCost = ExecutableCost

export type InstanceNode = {
  node_id: string
  url: string
  ipv6: string
  supports_ipv6: boolean
}

export type InstanceStatus = {
  vm_hash: string
  vm_type: EntityType.Instance | EntityType.Program
  vm_ipv6: string
  period: {
    start_timestamp: string
    duration_seconds: number
  }
  node: InstanceNode
}

export class InstanceManager
  extends Executable
  implements EntityManager<Instance, AddInstance>
{
  static addSchema = instanceSchema
  static addStreamSchema = instanceStreamSchema

  /**
   * Reference: https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
   */
  static getCost = (props: InstanceCostProps): Promise<InstanceCost> => {
    return Executable.getExecutableCost({
      ...props,
      type: EntityType.Instance,
    })
  }

  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected sshKeyManager: SSHKeyManager,
    protected fileManager: FileManager,
    protected channel = defaultInstanceChannel,
  ) {
    super(account, volumeManager, domainManager)
  }

  async getAll(): Promise<Instance[]> {
    try {
      const response = await any.GetMessages({
        addresses: [this.account.address],
        messageType: MessageType.instance,
        channels: [this.channel],
        APIServer: apiServer,
      })

      return await this.parseMessages(response.messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Instance | undefined> {
    const message = await any.GetMessage({
      hash: id,
      messageType: MessageType.instance,
      channel: this.channel,
    })

    const [entity] = await this.parseMessages([message])
    return entity
  }

  async add(newInstance: AddInstance): Promise<Instance> {
    try {
      const instanceMessage = await this.parseInstance(newInstance)

      if (newInstance.payment?.type === PaymentMethod.Stream) {
        const { streamCost, streamDuration, sender, receiver } = newInstance.payment
        const web3Provider = new Web3Provider(window.ethereum)

        const superfluidAccount = new superfluid.SuperfluidAccount(
          web3Provider,
          sender,
        )
        await superfluidAccount.init()
        await superfluidAccount.decreaseALEPHxFlow(receiver, 10)
        const alephxBalance = await superfluidAccount.getALEPHxBalance()
        const alephxFlow = await superfluidAccount.getALEPHxFlow(receiver)
        const usedAlephInDuration = alephxFlow.mul(getHours(streamDuration))
        const totalRequiredAleph = usedAlephInDuration.add(streamCost)
        if (alephxBalance.lt(totalRequiredAleph)) {
          throw new Error(`Insufficient balance: ${totalRequiredAleph.sub(alephxBalance).toString()} ALEPH required. Try to lower the VM cost or the duration.`)
        }
        await superfluidAccount.increaseALEPHxFlow(receiver, streamCost / getHours(streamDuration))
      }

      const response = await instance.publish({
        ...instanceMessage,
        APIServer: apiServer,
      })

      const [entity] = await this.parseMessages([response])

      // @note: Add the domain link
      await this.parseDomains(entity.id, newInstance.domains)

      return entity
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(instanceOrId: string | Instance): Promise<void> {
    let instance: Instance | undefined
    if (typeof instanceOrId !== 'string') {
      instance = instanceOrId
      instanceOrId = instance.id
    } else {
      instance = await this.get(instanceOrId)
    }

    if (!instance) throw new Error('Invalid instance ID')

    if (instance.payment?.type === PaymentType.superfluid) {
      const { sender, receiver } = instance.payment as StreamPaymentConfiguration
      const instanceCosts = await InstanceManager.getCost({
        paymentMethod: PaymentMethod.Stream,
        specs: {
          cpu: instance.resources.vcpus,
          memory: instance.resources.memory,
          storage: instance.volumes.reduce((ac, cv) => ac + cv["size_mb"] ?? 0, 0),
          ram: instance.resources.memory,
        }
      })
      console.log("instanceCosts", instanceCosts)
      const web3Provider = new Web3Provider(window.ethereum)

      const superfluidAccount = new superfluid.SuperfluidAccount(
        web3Provider,
        sender,
      )
      await superfluidAccount.init()
      await superfluidAccount.decreaseALEPHxFlow(receiver, instanceCosts.totalStreamCost)
    }

    try {
      await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [instanceOrId],
        APIServer: apiServer,
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async checkStatus(instance: Instance): Promise<InstanceStatus | undefined> {
    const query = await fetch(
      `https://scheduler.api.aleph.sh/api/v0/allocation/${instance.id}`,
    )

    if (query.status === 404) return

    const response = await query.json()
    return response
  }

  protected async parseInstance(
    newInstance: AddInstance,
  ): Promise<InstancePublishConfiguration> {
    newInstance = await InstanceManager.addSchema.parseAsync(newInstance)

    const { account, channel } = this

    const { envVars, specs, image, sshKeys, name, tags } = newInstance

    const variables = this.parseEnvVars(envVars)
    const resources = this.parseSpecs(specs)
    const metadata = this.parseMetadata(name, tags)
    const authorized_keys = await this.parseSSHKeys(sshKeys)
    const volumes = await this.parseVolumes(newInstance.volumes)
    const payment = this.parsePayment(newInstance.payment)

    return {
      account,
      channel,
      variables,
      resources,
      metadata,
      image,
      authorized_keys,
      volumes,
      payment,
    }
  }

  protected async parseVolumes(
    volumes?: VolumeField | VolumeField[],
  ): Promise<MachineVolume[] | undefined> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]

    // @note: Remove the fake volumes from the instance volume list configuration
    volumes = volumes.filter((volume) => !volume.isFake)

    return super.parseVolumes(volumes)
  }

  protected async parseSSHKeys(
    sshKeys?: SSHKeyField[],
  ): Promise<string[] | undefined> {
    if (!sshKeys || sshKeys.length === 0) return

    // @note: Create new keys before instance
    const newKeys = sshKeys.filter((key) => key.isNew && key.isSelected)
    await this.sshKeyManager.add(newKeys, false)

    return sshKeys.filter((key) => key.isSelected).map(({ key }) => key)
  }

  protected async parseMessages(messages: any[]): Promise<Instance[]> {
    const sizesMap = await this.fileManager.getSizesMap()

    return messages
      .filter(({ content }) => content !== undefined)
      .map((message) => {
        const size = message.content.volumes.reduce(
          (ac: number, cv: MachineVolume) =>
            ac + ('size_mib' in cv ? cv.size_mib : sizesMap[cv.ref]),
          0,
        )

        return {
          id: message.item_hash,
          ...message.content,
          type: EntityType.Instance,
          url: getExplorerURL(message),
          date: getDate(message.time),
          size,
          confirmed: !!message.confirmed,
        }
      })
  }
}
