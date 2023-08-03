import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, instance, any } from 'aleph-sdk-ts/dist/messages'
import { InstancePublishConfiguration } from 'aleph-sdk-ts/dist/messages/instance/publish'

import E_ from '../helpers/errors'
import { EntityType, defaultInstanceChannel } from '../helpers/constants'
import { getDate, getExplorerURL, isValidItemHash } from '../helpers/utils'
import { MachineVolume, MessageType } from 'aleph-sdk-ts/dist/messages/types'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import { InstanceContent } from 'aleph-sdk-ts/dist/messages/instance/types'
import { Executable, ExecutableCost, ExecutableCostProps } from './executable'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { InstanceImageField } from '@/hooks/form/useSelectInstanceImage'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { DomainManager } from './domain'
import { EntityManager } from './types'

export type AddInstance = Omit<
  InstancePublishConfiguration,
  'image' | 'account' | 'channel' | 'authorized_keys' | 'resources' | 'volumes'
> & {
  image?: InstanceImageField
  name?: string
  tags?: string[]
  sshKeys?: SSHKeyField[]
  envVars?: EnvVarField[]
  specs?: InstanceSpecsField
  volumes?: VolumeField[]
  domains?: DomainField[]
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
  /**
   * Reference: https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
   */
  static getCost = (props: InstanceCostProps): InstanceCost => {
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
      const { account, channel } = this
      const { envVars, sshKeys, specs, name, tags } = newInstance

      const variables = this.parseEnvVars(envVars)
      const resources = this.parseSpecs(specs)
      const metadata = this.parseMetadata(name, tags)
      const image = this.parseImage(newInstance.image)
      const authorized_keys = await this.parseSSHKeys(sshKeys)
      const volumes = await this.parseVolumes(newInstance.volumes)

      const response = await instance.publish({
        account,
        channel,
        variables,
        authorized_keys,
        resources,
        image,
        volumes,
        metadata,
      })

      const [entity] = await this.parseMessages([response])

      // @note: Add the domain link
      await this.parseDomains(
        EntityType.Instance,
        entity.id,
        newInstance.domains,
      )

      return entity
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(instanceOrId: string | Instance): Promise<void> {
    instanceOrId =
      typeof instanceOrId === 'string' ? instanceOrId : instanceOrId.id

    try {
      await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [instanceOrId],
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

  protected async parseSSHKeys(
    sshKeys?: SSHKeyField[],
  ): Promise<string[] | undefined> {
    if (!sshKeys) return

    // @note: Create new keys before instance
    const newKeys = sshKeys.filter((key) => key.isNew && key.isSelected)
    await this.sshKeyManager.add(newKeys, false)

    return sshKeys
      .filter((key) => key.isSelected)
      .map(({ key }) => {
        key = key.trim()
        if (key.length <= 0) throw new Error(`Invalid ssh key "${key}"`)

        return key
      })
  }

  protected parseImage(image?: InstanceImageField): string {
    const ref = image
    if (!ref || !isValidItemHash(ref)) throw new Error('Invalid image ref')

    return ref
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
