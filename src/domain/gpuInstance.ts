/* eslint-disable @typescript-eslint/no-unused-vars */
import { Account } from '@aleph-sdk/account'
import {
  HostRequirements,
  InstanceContent,
  InstancePublishConfiguration,
  MessageType,
  Payment,
  PaymentType,
} from '@aleph-sdk/message'
import {
  CheckoutStepType,
  communityWalletAddress,
  defaultGpuInstanceChannel,
  EntityType,
  EXTRA_WEI,
  PaymentMethod,
} from '@/helpers/constants'
import { getDate, getExplorerURL } from '@/helpers/utils'
import {
  ExecutableCost,
  ExecutableCostProps,
  ExecutableManager,
  ExecutableStatus,
} from './executable'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainManager } from './domain'
import { EntityManager } from './types'
import { CRNSpecs, NodeManager } from './node'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { AddInstance } from './instance'
import { SuperfluidAccount } from '@aleph-sdk/superfluid'
import Err from '@/helpers/errors'
import { getHours } from '@/hooks/form/useSelectStreamDuration'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import { instanceStreamSchema } from '@/helpers/schemas/instance'

export type GpuInstanceStatus = ExecutableStatus | undefined

export type GpuInstanceCostProps = Omit<ExecutableCostProps, 'type'>

export type GpuInstanceCost = ExecutableCost

// @todo: Refactor
export type GpuInstance = InstanceContent & {
  type: EntityType.GpuInstance
  payment: Payment & {
    type: PaymentType.superfluid
  }
  id: string // hash
  name: string
  url: string
  date: string
  size: number
  confirmed?: boolean
}

export class GpuInstanceManager
  extends ExecutableManager
  implements EntityManager<GpuInstance, unknown>
{
  static addStreamSchema = instanceStreamSchema

  static getCost = (props: GpuInstanceCostProps): Promise<GpuInstanceCost> => {
    return ExecutableManager.getExecutableCost({
      ...props,
      type: EntityType.GpuInstance,
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
    protected channel = defaultGpuInstanceChannel,
  ) {
    super(account, volumeManager, domainManager, nodeManager, sdkClient)
  }

  async add(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): Promise<GpuInstance> {
    const steps = this.addSteps(newInstance, account)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, GpuInstance, void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      yield* this.addPAYGStreamSteps(newInstance, account)

      const gpuInstanceMessage = yield* this.parseInstanceSteps(newInstance)

      yield

      const response = await this.sdkClient.createInstance({
        ...gpuInstanceMessage,
      })

      const [entity] = await this.parseMessages([response])

      console.log('entity', entity)

      // @note: Add the domain link
      yield* this.parseDomainsSteps(entity.id, newInstance.domains)

      yield
      await this.notifyCRNAllocation(newInstance.node!, entity.id, false)

      return entity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async del(
    instanceOrId: string | GpuInstance,
    account?: SuperfluidAccount,
  ): Promise<void> {
    let instance: GpuInstance | undefined

    if (typeof instanceOrId !== 'string') {
      instance = instanceOrId
      instanceOrId = instance.id
    } else {
      instance = await this.get(instanceOrId)
    }

    if (!instance) throw Err.InstanceNotFound
    if (!account) throw Err.ConnectYourPaymentWallet

    const { receiver } = instance.payment
    if (!receiver) throw Err.ReceiverReward

    const instanceCosts = await GpuInstanceManager.getCost({
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

    const { totalCost } = instanceCosts

    await account.decreaseALEPHFlow(receiver, this.calculateReceiverFlow(0.84))

    await account.decreaseALEPHFlow(
      communityWalletAddress,
      this.calculateCommunityFlow(0.84),
    )

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

    steps.push('stream')

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
    instancesOrIds: string | GpuInstance | (string | GpuInstance)[],
  ): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    instancesOrIds = Array.isArray(instancesOrIds)
      ? instancesOrIds
      : [instancesOrIds]
    instancesOrIds.forEach((instance) => {
      steps.push('streamDel')
      steps.push('instanceDel')
    })
    return steps
  }

  async *delSteps(
    instancesOrIds: string | GpuInstance | (string | GpuInstance)[],
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

  async getAll(): Promise<GpuInstance[]> {
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

  async get(id: string): Promise<GpuInstance | undefined> {
    const message = await this.sdkClient.getMessage(id)

    const [entity] = await this.parseMessages([message])
    return entity
  }

  protected async parseMessages(messages: any[]): Promise<GpuInstance[]> {
    return messages
      .filter(({ content }) => {
        if (content === undefined) return false

        // Filter GPU Instances
        return content.requirements?.gpu?.length
      })
      .map((message) => {
        return {
          id: message.item_hash,
          ...message.content,
          name: message.content.metadata?.name || 'Unnamed instance',
          type: EntityType.GpuInstance,
          url: getExplorerURL(message),
          date: getDate(message.time),
          size: message.content.rootfs?.size_mib || 0,
          confirmed: !!message.confirmed,
        }
      })
  }

  protected async *addPAYGStreamSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, void, void> {
    if (newInstance.payment?.type !== PaymentMethod.Stream)
      throw Err.UnsupportedPaymentMethod(newInstance.payment?.type)
    if (!account) throw Err.ConnectYourWallet
    if (!newInstance.node || !newInstance.node.address) throw Err.InvalidNode

    const { streamCost, streamDuration, receiver } = newInstance.payment

    ///
    const streamCostByHourToReceiverOld =
      this.calculateReceiverFlow(streamCost / getHours(streamDuration)) +
      EXTRA_WEI
    const streamCostByHourToCommunityOld =
      this.calculateCommunityFlow(streamCost / getHours(streamDuration)) +
      EXTRA_WEI

    console.log('streamCostByHourToReceiverOld', streamCostByHourToReceiverOld)
    console.log(
      'streamCostByHourToCommunityOld',
      streamCostByHourToCommunityOld,
    )

    ///

    console.log(streamCost, streamDuration, receiver)
    const streamCostByHourToReceiver = this.calculateReceiverFlow(0.84)
    const streamCostByHourToCommunity = this.calculateCommunityFlow(0.84)

    const alephxBalance = await account.getALEPHBalance()
    const recieverAlephxFlow = await account.getALEPHFlow(receiver)
    const communityAlephxFlow = await account.getALEPHFlow(
      communityWalletAddress,
    )

    const receiverTotalFlow = recieverAlephxFlow.add(streamCostByHourToReceiver)
    const communityTotalFlow = communityAlephxFlow.add(
      streamCostByHourToCommunity,
    )

    if (receiverTotalFlow.greaterThan(1) || communityTotalFlow.greaterThan(1))
      throw Err.MaxFlowRate

    const totalAlephxFlow = recieverAlephxFlow.add(communityAlephxFlow)
    const usedAlephInDuration = totalAlephxFlow.mul(getHours(streamDuration))
    const totalRequiredAleph = usedAlephInDuration.add(streamCost)

    if (alephxBalance.lt(totalRequiredAleph))
      throw Err.InsufficientBalance(
        totalRequiredAleph.sub(alephxBalance).toNumber(),
      )

    yield

    // Split the stream cost between the community wallet (20%) and the receiver (80%)
    console.log('streamCostByHourToCommunity', streamCostByHourToCommunity)
    console.log('streamCostByHourToReceiver', streamCostByHourToReceiver)

    await account.increaseALEPHFlow(
      communityWalletAddress,
      streamCostByHourToCommunity,
    )
    await account.increaseALEPHFlow(receiver, streamCostByHourToReceiver)
  }

  protected async *parseInstanceSteps(
    newInstance: AddInstance,
  ): AsyncGenerator<void, InstancePublishConfiguration, void> {
    newInstance =
      await GpuInstanceManager.addStreamSchema.parseAsync(newInstance)

    if (!newInstance.node) throw Err.MissingNodeData

    const { account, channel } = this

    const { envVars, specs, image, sshKeys, name, tags, node } = newInstance

    const variables = this.parseEnvVars(envVars)
    const resources = this.parseSpecs(specs)
    const metadata = this.parseMetadata(name, tags)
    const requirements = this.parseRequirements(node)
    const payment = this.parsePayment(newInstance.payment)
    const authorized_keys = yield* this.parseSSHKeysSteps(sshKeys)
    const volumes = yield* this.parseVolumesSteps(newInstance.volumes)

    console.log('return', {
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
    })
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

  protected parseRequirements(node: CRNSpecs): HostRequirements | undefined {
    const requirements = {
      node: {
        node_hash: node.hash,
      },
      gpu: [
        {
          vendor: node.selectedGpu?.vendor,
          device_name: node.selectedGpu?.device_name,
          device_class: node.selectedGpu?.device_class,
          device_id: node.selectedGpu?.device_id,
        },
      ],
    } as HostRequirements

    if (node.terms_and_conditions)
      requirements.node = {
        ...requirements.node,
        terms_and_conditions: node.terms_and_conditions,
      }

    return requirements
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

  protected calculateCommunityFlow(streamCost: number): number {
    return streamCost * 0.2
  }

  protected calculateReceiverFlow(streamCost: number): number {
    return streamCost * 0.8
  }
}
