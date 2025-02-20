/* eslint-disable @typescript-eslint/no-unused-vars */
import { Account } from '@aleph-sdk/account'
import { InstanceContent, MessageType } from '@aleph-sdk/message'
import {
  CheckoutStepType,
  defaultInstanceChannel,
  EntityType,
} from '@/helpers/constants'
import { getDate, getExplorerURL } from '@/helpers/utils'
import { ExecutableManager, ExecutableStatus } from './executable'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainManager } from './domain'
import { EntityManager } from './types'
import {
  instanceSchema,
  instanceStreamSchema,
} from '@/helpers/schemas/instance'
import { NodeManager } from './node'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'

export type ConfidentialStatus = ExecutableStatus | undefined

// @todo: Refactor
export type Confidential = InstanceContent & {
  type: EntityType.Instance
  id: string // hash
  name: string
  url: string
  date: string
  size: number
  confirmed?: boolean
}

export class ConfidentialManager
  extends ExecutableManager<Confidential>
  implements EntityManager<Confidential, unknown>
{
  static addSchema = instanceSchema
  static addStreamSchema = instanceStreamSchema

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected sshKeyManager: SSHKeyManager,
    protected fileManager: FileManager,
    protected nodeManager: NodeManager,
    protected channel = defaultInstanceChannel,
  ) {
    super(account, volumeManager, domainManager, nodeManager, sdkClient)
  }

  add(entity: unknown): Promise<Confidential | Confidential[]> {
    throw new Error('Method not implemented.')
  }
  del(entityOrId: string | Confidential): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getAddSteps(entity: unknown): Promise<CheckoutStepType[]> {
    throw new Error('Method not implemented.')
  }
  addSteps(
    entity: unknown,
  ): AsyncGenerator<void, Confidential | Confidential[], void> {
    throw new Error('Method not implemented.')
  }
  getDelSteps(
    entity: string | Confidential | (string | Confidential)[],
  ): Promise<CheckoutStepType[]> {
    throw new Error('Method not implemented.')
  }
  delSteps(
    entity: string | Confidential | (string | Confidential)[],
    extra?: any,
  ): AsyncGenerator<void> {
    throw new Error('Method not implemented.')
  }

  async getAll(): Promise<Confidential[]> {
    if (!this.account) return []

    try {
      const response = await this.sdkClient.getMessages({
        addresses: [this.account.address],
        messageTypes: [MessageType.instance],
      })

      return await this.parseMessages(response.messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Confidential | undefined> {
    const message = await this.sdkClient.getMessage(id)

    const [entity] = await this.parseMessages([message])
    return entity
  }

  protected async parseMessages(messages: any[]): Promise<Confidential[]> {
    return messages
      .filter(({ content }) => {
        if (content === undefined) return false

        // Filter confidential VMs
        return content.environment?.trusted_execution
      })
      .map((message) => {
        return {
          id: message.item_hash,
          ...message.content,
          name: message.content.metadata?.name || 'Unnamed instance',
          type: EntityType.Instance,
          url: getExplorerURL(message),
          date: getDate(message.time),
          size: message.content.rootfs?.size_mib || 0,
          confirmed: !!message.confirmed,
        }
      })
  }
}
