import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, instance, any } from 'aleph-sdk-ts/dist/messages'
import { InstancePublishConfiguration } from 'aleph-sdk-ts/dist/messages/instance/publish'

import E_ from '../helpers/errors'
import { EntityType, defaultInstanceChannel } from '../helpers/constants'
import { getDate, getExplorerURL, isValidItemHash } from '../helpers/utils'
import {
  InstanceMessage,
  MachineVolume,
  MessageType,
} from 'aleph-sdk-ts/dist/messages/types'
import { EnvVarProp } from '@/hooks/form/useAddEnvVars'
import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'
import { SSHKeyProp } from '@/hooks/form/useAddSSHKeys'
import { InstanceContent } from 'aleph-sdk-ts/dist/messages/instance/types'
import { Executable } from './executable'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import { InstanceImageProp } from '@/hooks/form/useSelectInstanceImage'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'

export type AddInstance = Omit<
  InstancePublishConfiguration,
  'image' | 'account' | 'channel' | 'authorized_keys' | 'resources' | 'volumes'
> & {
  image?: InstanceImageProp
  name?: string
  tags?: string[]
  sshKeys?: SSHKeyProp[]
  envVars?: EnvVarProp[]
  specs?: InstanceSpecsProp
  volumes?: VolumeProp[]
}

// @todo: Refactor
export type Instance = InstanceContent & {
  type: EntityType.Instance
  id: string // hash
  url: string
  date: string
  size?: number
}

export class InstanceManager extends Executable {
  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
    protected sshKeyManager: SSHKeyManager,
    protected fileManager: FileManager,
    protected channel = defaultInstanceChannel,
  ) {
    super(account, volumeManager)
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

    const [data] = await this.parseMessages([message])
    return data
  }

  async add(newInstance: AddInstance): Promise<InstanceMessage> {
    try {
      const { account, channel } = this
      const { envVars, sshKeys, specs, name, tags } = newInstance

      const variables = this.parseEnvVars(envVars)
      const resources = this.parseSpecs(specs)
      const metadata = this.parseMetadata(name, tags)
      const image = this.parseImage(newInstance.image)
      const authorized_keys = await this.parseSSHKeys(sshKeys)
      const volumes = await this.parseVolumes(newInstance.volumes)

      return await instance.publish({
        account,
        channel,
        variables,
        authorized_keys,
        resources,
        image,
        volumes,
        metadata,
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(instanceOrId: string | Instance) {
    instanceOrId =
      typeof instanceOrId === 'string' ? instanceOrId : instanceOrId.id

    try {
      return await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [instanceOrId],
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  protected async parseSSHKeys(
    sshKeys?: SSHKeyProp[],
  ): Promise<string[] | undefined> {
    if (!sshKeys) return

    // @note: Create new keys before instance
    const newKeys = sshKeys.filter((key) => key.isNew && key.isSelected)
    await Promise.all(
      newKeys.map(({ key, label }) => this.sshKeyManager.add({ key, label })),
    )

    return sshKeys
      .filter((key) => key.isSelected)
      .map(({ key }) => {
        key = key.trim()
        if (key.length <= 0) throw new Error(`Invalid ssh key "${key}"`)

        return key
      })
  }

  protected parseImage(image?: InstanceImageProp): string {
    const ref = image?.id
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
        }
      })
  }
}
