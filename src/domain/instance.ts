import { Account } from '@aleph-sdk/account'
import { SuperfluidAccount } from '@aleph-sdk/superfluid'
import {
  HostRequirements,
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
  EXTRA_WEI,
} from '@/helpers/constants'
import { getDate, getExplorerURL } from '@/helpers/utils'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import {
  ExecutableManager,
  PaymentConfiguration,
  ExecutableStatus,
} from './executable'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { InstanceImageField } from '@/hooks/form/useSelectInstanceImage'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { DomainManager } from './domain'
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
import Err from '@/helpers/errors'
import { CostSummary } from './cost'

export type AddInstance = Omit<
  InstancePublishConfiguration,
  | 'image'
  | 'account'
  | 'channel'
  | 'authorized_keys'
  | 'resources'
  | 'volumes'
  | 'payment'
  | 'requirements'
> &
  NameAndTagsField & {
    image: InstanceImageField
    specs: InstanceSpecsField
    sshKeys: SSHKeyField[]
    volumes?: VolumeField[]
    envVars?: EnvVarField[]
    domains?: Omit<DomainField, 'ref'>[]
    payment?: PaymentConfiguration
    requirements?: HostRequirements
    node?: CRN
  }

// @todo: Refactor
export type Instance = InstanceContent & {
  type: EntityType.Instance
  id: string // hash
  name: string
  url: string
  date: string
  size: number
  confirmed?: boolean
}

export type InstanceCostProps = AddInstance

export type InstanceCost = CostSummary

export type InstanceCRNNetworking = {
  ipv4: string
  ipv6: string
}

export type InstanceStatus = ExecutableStatus

export class InstanceManager
  extends ExecutableManager
  implements EntityManager<Instance, AddInstance>
{
  static addSchema = instanceSchema
  static addStreamSchema = instanceStreamSchema

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
    super(account, volumeManager, domainManager, nodeManager, sdkClient)
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
        await this.notifyCRNAllocation(newInstance.node, entity.id, false)
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

    if (!instance) throw Err.InstanceNotFound

    if (instance.payment?.type === PaymentType.superfluid) {
      if (!account) throw Err.ConnectYourPaymentWallet
      const { receiver } = instance.payment
      if (!receiver) throw Err.ReceiverReward

      const instanceCosts = await this.getCost({
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

      await account.decreaseALEPHFlow(receiver, instanceCosts.cost + EXTRA_WEI)
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

  async getAddSteps(newInstance: AddInstance): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    const { sshKeys, volumes = [], domains = [] } = newInstance

    if (newInstance.payment?.type === PaymentMethod.Stream) steps.push('stream')

    const newKeys = this.parseNewSSHKeys(sshKeys)
    // @note: Aggregate all signatures in 1 step
    if (newKeys.length > 0) steps.push('ssh')

    // @note: Aggregate all signatures in 1 step
    if (volumes.length > 0) steps.push('volume')

    steps.push('instance')

    // @note: Aggregate all signatures in 1 step
    if (domains.length > 0) steps.push('domain')

    return steps
  }

  async getDelSteps(
    instancesOrIds: string | Instance | (string | Instance)[],
  ): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    instancesOrIds = Array.isArray(instancesOrIds)
      ? instancesOrIds
      : [instancesOrIds]
    instancesOrIds.forEach((instance) => {
      if (
        typeof instance !== 'string' &&
        instance.payment?.type === PaymentType.superfluid &&
        instance.payment?.receiver
      )
        steps.push('streamDel')
      steps.push('instanceDel')
    })
    return steps
  }

  async *delSteps(
    instancesOrIds: string | Instance | (string | Instance)[],
    account?: SuperfluidAccount,
  ): AsyncGenerator<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    instancesOrIds = Array.isArray(instancesOrIds)
      ? instancesOrIds
      : [instancesOrIds]
    if (instancesOrIds.length === 0) return

    try {
      for (const instanceOrId of instancesOrIds) {
        yield
        await this.del(instanceOrId, account)
      }
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async getTotalCostByHash(hash: string): Promise<number> {
    const costs = await this.sdkClient.instanceClient.getCost(hash)
    return Number(costs.cost)
  }

  async getCost(newInstance: InstanceCostProps): Promise<InstanceCost> {
    const totalStreamCost = Number.POSITIVE_INFINITY
    let totalCost = Number.POSITIVE_INFINITY
    const paymentMethod = newInstance.payment?.type || PaymentMethod.Hold

    const emptyCost: InstanceCost = {
      cost: totalCost,
      paymentMethod,
      lines: [],
    }

    let parsedInstance: InstancePublishConfiguration

    console.log('generating parsedInstance')
    try {
      const steps = this.parseInstanceSteps(newInstance, true)

      while (true) {
        const { value, done } = await steps.next()
        console.log('value', value)
        parsedInstance = value as any
        if (done) break
      }
    } catch (e) {
      console.error(e)
      return emptyCost
    }

    console.log('parsedInstance', parsedInstance)
    const costs =
      await this.sdkClient.instanceClient.getEstimatedCost(parsedInstance)
    console.log('costs', costs)

    totalCost = Number(costs.cost)

    const lines = this.getExecutableCostLines(
      {
        type: EntityType.Instance,
        ...parsedInstance,
      },
      costs,
    )

    return {
      cost: this.parseCost(paymentMethod, totalCost),
      paymentMethod,
      lines: [...lines],
    }

    // const streamCostPerHour =
    //   paymentMethod === PaymentMethod.Stream && streamDuration
    //     ? getHours(streamDuration)
    //     : Number.POSITIVE_INFINITY

    // const totalStreamCost = totalCost * streamCostPerHour

    // return {
    //   computeTotalCost,
    //   perVolumeCost,
    //   volumeTotalCost,
    //   totalCost,
    //   totalStreamCost,
    // }
  }

  protected async *addPAYGStreamSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, void, void> {
    if (newInstance.payment?.type !== PaymentMethod.Stream) return
    if (!account) throw Err.ConnectYourWallet
    if (!newInstance.node || !newInstance.node.address) throw Err.InvalidNode

    const { streamCost, streamDuration, receiver } = newInstance.payment

    const streamCostByHour = streamCost / getHours(streamDuration) + EXTRA_WEI
    const alephxBalance = await account.getALEPHBalance()
    const alephxFlow = await account.getALEPHFlow(receiver)
    const totalFlow = alephxFlow.add(streamCostByHour)

    if (totalFlow.greaterThan(1)) throw Err.MaxFlowRate

    const usedAlephInDuration = alephxFlow.mul(getHours(streamDuration))
    const totalRequiredAleph = usedAlephInDuration.add(streamCost)

    if (alephxBalance.lt(totalRequiredAleph))
      throw Err.InsufficientBalance(
        totalRequiredAleph.sub(alephxBalance).toNumber(),
      )

    yield
    await account.increaseALEPHFlow(receiver, streamCostByHour)
  }

  protected async *parseInstanceSteps(
    newInstance: AddInstance,
    estimateCost = false,
  ): AsyncGenerator<void, InstancePublishConfiguration, void> {
    const schema = !newInstance.node
      ? InstanceManager.addSchema
      : InstanceManager.addStreamSchema

    newInstance = await schema.parseAsync(newInstance)

    const { account, channel } = this

    const { envVars, specs, image, sshKeys, name, tags, node } = newInstance

    const variables = this.parseEnvVars(envVars)
    const resources = this.parseSpecs(specs)
    const metadata = this.parseMetadata(name, tags)
    const requirements = this.parseRequirements(node)
    const payment = this.parsePayment(newInstance.payment)
    const authorized_keys = yield* this.parseSSHKeysSteps(sshKeys, estimateCost)
    const volumes = yield* this.parseVolumesSteps(
      newInstance.volumes,
      estimateCost,
    )

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
      requirements,
    }
  }

  protected async *parseVolumesSteps(
    volumes?: VolumeField | VolumeField[],
    estimateCost?: boolean,
  ): AsyncGenerator<void, MachineVolume[] | undefined, void> {
    if (!volumes) return
    volumes = Array.isArray(volumes) ? volumes : [volumes]

    return yield* super.parseVolumesSteps(volumes, estimateCost)
  }

  protected async *parseSSHKeysSteps(
    sshKeys?: SSHKeyField[],
    estimateCost?: boolean,
  ): AsyncGenerator<void, string[] | undefined, void> {
    if (!estimateCost) {
      // @note: Create new keys before instance
      const newKeys = this.parseNewSSHKeys(sshKeys)
      yield* this.sshKeyManager.addSteps(newKeys, false)
    }

    return sshKeys?.filter((key) => key.isSelected).map(({ key }) => key)
  }

  protected parseNewSSHKeys(sshKeys?: SSHKeyField[]): SSHKeyField[] {
    return sshKeys?.filter((key) => key.isNew && key.isSelected) || []
  }

  protected async parseMessages(messages: any[]): Promise<Instance[]> {
    /* const sizesMap = await this.fileManager.getSizesMap() */

    return messages
      .filter(({ content }) => {
        if (content === undefined) return false

        // Filter out confidential VMs
        return !content.environment?.trusted_execution
      })
      .map((message) => {
        /* const size = message.content.volumes.reduce(
            (ac: number, cv: MachineVolume) =>
              ac + ('size_mib' in cv ? cv.size_mib : sizesMap[cv.ref]),
            0,
          ) */

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
