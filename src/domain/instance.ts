import { Account } from '@aleph-sdk/account'
import { SuperfluidAccount } from '@aleph-sdk/superfluid'
import {
  InstanceContent,
  InstancePublishConfiguration,
  MachineVolume,
  MessageType,
  PaymentType,
} from '@aleph-sdk/message'
import {
  defaultInstanceChannel,
  EntityType,
  PaymentMethod,
} from '../helpers/constants'
import { getDate, getExplorerURL, sleep } from '../helpers/utils'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import {
  Executable,
  ExecutableCost,
  ExecutableCostProps,
  PaymentConfiguration,
} from './executable'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { InstanceImageField } from '@/hooks/form/useSelectInstanceImage'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddDomain, DomainManager } from './domain'
import { EntityManager } from './types'
import {
  instanceSchema,
  instanceStreamSchema,
} from '@/helpers/schemas/instance'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { getHours } from '@/hooks/form/useSelectStreamDuration'
import { CRN, NodeManager } from './node'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import Err from '../helpers/errors'

export type AddInstance = Omit<
  InstancePublishConfiguration,
  | 'image'
  | 'account'
  | 'channel'
  | 'authorized_keys'
  | 'resources'
  | 'volumes'
  | 'payment'
> &
  NameAndTagsField & {
    image: InstanceImageField
    specs: InstanceSpecsField
    sshKeys: SSHKeyField[]
    volumes?: VolumeField[]
    envVars?: EnvVarField[]
    domains?: Omit<DomainField, 'ref'>[]
    payment?: PaymentConfiguration
    node?: CRN
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

export type InstanceCRNNetworking = {
  ipv4: string
  ipv6: string
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
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected sshKeyManager: SSHKeyManager,
    protected fileManager: FileManager,
    protected nodeManager: NodeManager,
    protected channel = defaultInstanceChannel,
  ) {
    super(account, volumeManager, domainManager, sdkClient)
  }

  async getAll(): Promise<Instance[]> {
    try {
      const response = await this.sdkClient.getMessages({
        addresses: [this.account.address],
        messageTypes: [MessageType.instance],
        channels: [this.channel],
      })

      return await this.parseMessages(response.messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Instance | undefined> {
    const message = await this.sdkClient.getMessage(id)

    const [entity] = await this.parseMessages([message])
    return entity
  }

  async add(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): Promise<Instance> {
    const steps = this.addSteps(newInstance, account)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, Instance, void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      yield* this.addPAYGStreamSteps(newInstance, account)

      const instanceMessage = yield* this.parseInstanceSteps(newInstance)

      yield

      const response = await this.sdkClient.createInstance({
        ...instanceMessage,
      })

      const [entity] = await this.parseMessages([response])

      // @note: Add the domain link
      yield* this.parseDomainsSteps(entity.id, newInstance.domains)

      // @note: Notify the CRN if it is a targeted stream
      if (
        newInstance.payment?.type === PaymentMethod.Stream &&
        newInstance.node
      ) {
        yield
        await this.notifyCRNExecution(newInstance.node, entity.id)
      }

      return entity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async del(
    instanceOrId: string | Instance,
    account?: SuperfluidAccount,
  ): Promise<void> {
    let instance: Instance | undefined
    if (typeof instanceOrId !== 'string') {
      instance = instanceOrId
      instanceOrId = instance.id
    } else {
      instance = await this.get(instanceOrId)
    }

    if (!instance) throw new Error('Invalid instance ID')

    if (instance.payment?.type === PaymentType.superfluid) {
      if (!account)
        throw new Error(
          'Invalid Superfluid/AVAX account. Please connect your wallet.',
        )

      const { receiver } = instance.payment

      if (!receiver)
        throw new Error(
          'Invalid Superfluid/AVAX receiver reward address. Please set it up in your CRN account profile.',
        )

      const instanceCosts = await InstanceManager.getCost({
        paymentMethod: PaymentMethod.Stream,
        specs: {
          cpu: instance.resources.vcpus,
          ram: instance.resources.memory,
          storage: instance.volumes.reduce(
            (ac, cv) => ac + ('size_mib' in cv ? cv.size_mib : 0),
            0,
          ),
        },
      })

      await account.decreaseALEPHFlow(receiver, instanceCosts.totalCost)
    }

    try {
      if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
        throw Err.InvalidAccount

      await this.sdkClient.forget({
        channel: this.channel,
        hashes: [instanceOrId],
      })
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async checkStatus(instance: Instance): Promise<InstanceStatus | undefined> {
    if (instance.payment?.type === PaymentType.superfluid) {
      const { receiver } = instance.payment

      if (!receiver)
        throw new Error(
          'Invalid Superfluid/AVAX receiver reward address. Please set it up in your CRN account profile.',
        )

      // @todo: refactor this mess
      const node = await this.nodeManager.getCRNByStreamRewardAddress(receiver)
      if (!node) return

      const { address } = node
      if (!address) throw new Error('Invalid CRN address')

      const nodeUrl = address.replace(/\/$/, '')
      const query = await fetch(`${nodeUrl}/about/executions/list`)
      const response = await query.json()

      const status = response[instance.id]
      if (!status) return

      const networking = status['networking']

      return {
        node: {
          node_id: node.hash,
          url: node.address,
          ipv6: networking.ipv6,
          supports_ipv6: true,
        },
        vm_hash: instance.id,
        vm_type: EntityType.Instance,
        vm_ipv6: this.formatVMIPv6Address(networking.ipv6),
        period: {
          start_timestamp: '',
          duration_seconds: 0,
        },
      } as InstanceStatus
    }
    const query = await fetch(
      `https://scheduler.api.aleph.sh/api/v0/allocation/${instance.id}`,
    )

    if (query.status === 404) return

    const response = await query.json()
    return response
  }

  async getSteps(newInstance: AddInstance): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    const { sshKeys, volumes = [], domains = [] } = newInstance

    if (newInstance.payment?.type === PaymentMethod.Stream) steps.push('stream')

    const newKeys = this.parseNewSSHKeys(sshKeys)
    const sshKeysSteps = await this.sshKeyManager.getSteps(newKeys)
    for (const step of sshKeysSteps) steps.push(step)

    const volumeSteps = await this.volumeManager.getSteps(volumes)
    for (const step of volumeSteps) steps.push(step)

    steps.push('instance')

    const domainSteps = await this.domainManager.getSteps(
      domains as AddDomain[],
    )
    for (const step of domainSteps) steps.push(step)

    return steps
  }

  protected async *addPAYGStreamSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, void, void> {
    if (newInstance.payment?.type !== PaymentMethod.Stream) return

    if (!account)
      throw new Error('Invalid Superfluid account. Please connect your wallet.')

    if (!newInstance.node || !newInstance.node.address)
      throw new Error('Invalid CRN')

    const { streamCost, streamDuration, receiver } = newInstance.payment
    const alephxBalance = await account.getALEPHBalance()
    const alephxFlow = await account.getALEPHFlow(receiver)
    const totalFlow = alephxFlow.add(streamCost / getHours(streamDuration))

    if (totalFlow.greaterThan(1))
      throw new Error(
        `Current maximum total flow rate of 1 ALEPH/hour exceeded. Delete other instances or lower the VM cost.`,
      )

    const usedAlephInDuration = alephxFlow.mul(getHours(streamDuration))
    const totalRequiredAleph = usedAlephInDuration.add(streamCost)

    if (alephxBalance.lt(totalRequiredAleph)) {
      throw new Error(
        `Insufficient balance: ${totalRequiredAleph
          .sub(alephxBalance)
          .toString()} ALEPH required. Try to lower the VM cost or the duration.`,
      )
    }

    yield
    await account.increaseALEPHFlow(
      receiver,
      streamCost / getHours(streamDuration),
    )
  }

  protected formatVMIPv6Address(ipv6: string): string {
    // Replace the trailing slash and number
    let newIpv6 = ipv6.replace(/\/\d+$/, '')
    // Replace the last '0' of the IPv6 address with '1'
    newIpv6 = newIpv6.replace(/0(?!.*0)/, '1')
    return newIpv6
  }

  protected async *parseInstanceSteps(
    newInstance: AddInstance,
  ): AsyncGenerator<void, InstancePublishConfiguration, void> {
    newInstance = await InstanceManager.addSchema.parseAsync(newInstance)

    const { account, channel } = this

    const { envVars, specs, image, sshKeys, name, tags } = newInstance

    const variables = this.parseEnvVars(envVars)
    const resources = this.parseSpecs(specs)
    const metadata = this.parseMetadata(name, tags)
    const payment = this.parsePayment(newInstance.payment)
    const authorized_keys = yield* this.parseSSHKeysSteps(sshKeys)
    const volumes = yield* this.parseVolumesSteps(newInstance.volumes)

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

  protected async *parseVolumesSteps(
    volumes?: VolumeField | VolumeField[],
  ): AsyncGenerator<void, MachineVolume[] | undefined, void> {
    if (!volumes) return
    volumes = Array.isArray(volumes) ? volumes : [volumes]

    return yield* super.parseVolumesSteps(volumes)
  }

  protected async *parseSSHKeysSteps(
    sshKeys?: SSHKeyField[],
  ): AsyncGenerator<void, string[] | undefined, void> {
    // @note: Create new keys before instance
    const newKeys = this.parseNewSSHKeys(sshKeys)
    yield* this.sshKeyManager.addSteps(newKeys, false)

    return sshKeys?.filter((key) => key.isSelected).map(({ key }) => key)
  }

  protected parseNewSSHKeys(sshKeys?: SSHKeyField[]): SSHKeyField[] {
    return sshKeys?.filter((key) => key.isNew && key.isSelected) || []
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

  protected async notifyCRNExecution(
    node: CRN,
    instanceId: string,
  ): Promise<void> {
    if (!node.address) throw new Error('Invalid node address')

    let errorMsg = ''
    for (let i = 0; i < 5; i++) {
      try {
        // strip trailing slash
        const nodeUrl = node.address.replace(/\/$/, '')
        const req = await fetch(`${nodeUrl}/control/allocation/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instance: instanceId,
          }),
        })
        const resp = await req.json()
        if (resp.success) return
        errorMsg = resp.errors[instanceId]
        await sleep(1000)
      } catch (e) {
        errorMsg = (e as Error).message
        await sleep(1000)
      }
    }
    throw new Error(`Failed to start instance on CRN ${node.hash}: ${errorMsg}`)
  }
}
