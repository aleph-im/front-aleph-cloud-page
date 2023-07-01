import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, instance, any } from 'aleph-sdk-ts/dist/messages'
import { InstancePublishConfiguration } from 'aleph-sdk-ts/dist/messages/instance/publish'

import E_ from './errors'
import { defaultInstanceChannel } from './constants'
import { getDate, getExplorerURL, isValidItemHash, parseEnvVars } from './utils'
import {
  InstanceMessage,
  MachineResources,
  MachineVolume,
  MessageType,
} from 'aleph-sdk-ts/dist/messages/types'
import { EnvVar } from '@/hooks/form/useAddEnvVars'
import { InstanceSpecs } from '@/hooks/form/useSelectInstanceSpecs'
import { Volume, displayVolumesToAlephVolumes } from '@/hooks/form/useAddVolume'
import { InstanceImage } from '@/hooks/form/useSelectInstanceImage'
import { SSHKeyItem } from '@/hooks/form/useAddSSHKeys'
import { SSHKeyStore } from './ssh'
import { InstanceContent } from 'aleph-sdk-ts/dist/messages/instance/types'

export type NewInstance = Omit<
  InstancePublishConfiguration,
  'image' | 'account' | 'channel' | 'authorized_keys' | 'resources' | 'volumes'
> & {
  image?: InstanceImage
  name?: string
  tags?: string[]
  sshKeys?: SSHKeyItem[]
  envVars?: EnvVar[]
  specs?: InstanceSpecs
  volumes?: Volume[]
}

// @todo: Refactor
export type Instance = InstanceContent & {
  id: string // hash
  url: string
  date: string
}

export class InstanceManager {
  constructor(
    protected account: Account,
    protected channel = defaultInstanceChannel,
  ) {}

  async getAll(): Promise<Instance[]> {
    try {
      const response = await any.GetMessages({
        addresses: [this.account.address],
        messageType: MessageType.instance,
        channels: [this.channel],
      })

      return this.parseMessages(response.messages)
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

    const [data] = this.parseMessages([message])
    return data
  }

  async add(newInstance: NewInstance): Promise<InstanceMessage> {
    try {
      const { account, channel } = this
      const { envVars, sshKeys, specs, name, tags } = newInstance

      const variables = this.parseEnvVars(envVars)
      const resources = this.parseInstanceSpecs(specs)
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

  protected parseEnvVars(
    envVars?: EnvVar[],
  ): Record<string, string> | undefined {
    return parseEnvVars(envVars)
  }

  protected async parseSSHKeys(
    sshKeys?: SSHKeyItem[],
  ): Promise<string[] | undefined> {
    if (!sshKeys) return

    // @note: Create new keys before instance
    const newKeys = sshKeys.filter((key) => key.isNew && key.isSelected)
    const sshKeyStore = new SSHKeyStore(this.account)
    await Promise.all(
      newKeys.map(({ key, label }) => sshKeyStore.add({ key, label })),
    )

    return sshKeys
      .filter((key) => key.isSelected)
      .map(({ key }) => {
        key = key.trim()
        if (key.length <= 0) throw new Error(`Invalid ssh key "${key}"`)

        return key
      })
  }

  protected parseInstanceSpecs(
    specs?: InstanceSpecs,
  ): Partial<MachineResources> {
    if (!specs) throw new Error('Invalid instance specs')
    if (!specs.cpu) throw new Error('Invalid instance cpu cores')
    if (!specs.ram) throw new Error('Invalid instance ram size')

    return {
      vcpus: specs.cpu,
      memory: specs.ram,
    }
  }

  protected async parseVolumes(
    volumes?: Volume[],
  ): Promise<MachineVolume[] | undefined> {
    return volumes
      ? await displayVolumesToAlephVolumes(this.account, volumes)
      : []
  }

  protected parseImage(image?: InstanceImage): string {
    const ref = image?.id
    if (!ref || !isValidItemHash(ref)) throw new Error('Invalid image ref')

    return ref
  }

  protected parseMetadata(name = 'Untitled instance', tags?: string[]): any {
    const metadata: Record<string, unknown> = {}

    name = name.trim()

    if (name) {
      metadata.name = name
    }

    if (tags && tags.length > 0) {
      metadata.tags = tags
    }

    return metadata
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // @todo: Type not exported from SDK...
  protected parseMessages(messages: any[]): Instance[] {
    return messages
      .filter(({ content }) => content !== undefined)
      .map((message) => {
        return {
          id: message.hash,
          ...message.content,
          url: getExplorerURL(message),
          date: getDate(message.time),
        }
      })
  }
}
