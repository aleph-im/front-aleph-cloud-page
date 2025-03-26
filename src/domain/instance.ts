import { Account } from '@aleph-sdk/account'
import { createFromEVMAccount, SuperfluidAccount } from '@aleph-sdk/superfluid'
import {
  HostRequirements,
  InstanceContent,
  InstancePublishConfiguration,
  MessageType,
  PaymentType,
  RootfsVolumeConfiguration,
} from '@aleph-sdk/message'
import {
  defaultInstanceChannel,
  EntityType,
  EXTRA_WEI,
  PaymentMethod,
} from '@/helpers/constants'
import { getDate, getExplorerURL } from '@/helpers/utils'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import {
  ExecutableManager,
  PaymentConfiguration,
  ExecutableStatus,
  StreamPaymentDetails,
  StreamPaymentDetail,
} from './executable'
import {
  InstanceSystemVolumeField,
  VolumeField,
} from '@/hooks/form/useAddVolume'
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
import { CRNSpecs, NodeManager } from './node'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import Err from '@/helpers/errors'
import { CostManager, CostSummary } from './cost'
import { EVMAccount } from '@aleph-sdk/evm'
import { BlockchainId } from './connect/base'
import { mockAccount } from './account'

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
  | 'rootfs'
> &
  NameAndTagsField & {
    image: InstanceImageField
    specs: InstanceSpecsField
    sshKeys: SSHKeyField[]
    volumes?: VolumeField[]
    systemVolume: InstanceSystemVolumeField
    envVars?: EnvVarField[]
    domains?: Omit<DomainField, 'ref'>[]
    payment?: PaymentConfiguration
    requirements?: HostRequirements
    node?: CRNSpecs
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

export type InstanceEntity = Omit<Instance, 'type'> & {
  type: EntityType.Instance | EntityType.GpuInstance
}

export class InstanceManager<T extends InstanceEntity = Instance>
  extends ExecutableManager<T>
  implements EntityManager<T, AddInstance>
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
    protected costManager: CostManager,
    protected channel = defaultInstanceChannel,
  ) {
    super(account, volumeManager, domainManager, nodeManager, sdkClient)
  }

  async getAll(): Promise<T[]> {
    if (!this.account) return []

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

  async get(id: string): Promise<T | undefined> {
    const message = await this.sdkClient.getMessage(id)

    const [entity] = await this.parseMessages([message])
    return entity
  }

  async add(newInstance: AddInstance, account?: SuperfluidAccount): Promise<T> {
    const steps = this.addSteps(newInstance, account)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, T, void> {
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

  // TODO: Check if message and flow exists
  async del(
    instanceOrId: string | T,
    account?: SuperfluidAccount,
  ): Promise<void> {
    const instance = await this.ensureInstance(instanceOrId)

    if (instance.payment?.type === PaymentType.superfluid) {
      if (!account) throw Err.ConnectYourPaymentWallet
      const { receiver } = instance.payment
      if (!receiver) throw Err.ReceiverReward

      const { communityWalletAddress, communityWalletTimestamp } =
        await this.costManager.getSettingsAggregate()

      const instanceCosts = await this.getTotalCostByHash(
        instance.payment?.type,
        instance.id,
      )

      const results = await Promise.allSettled(
        instance.time >= communityWalletTimestamp
          ? [
              // @note: Instances created after split of flows between receiver and community wallet
              account.decreaseALEPHFlow(
                receiver,
                this.calculateReceiverFlow(instanceCosts) + EXTRA_WEI,
              ),
              account.decreaseALEPHFlow(
                communityWalletAddress,
                this.calculateCommunityFlow(instanceCosts) + EXTRA_WEI,
              ),
            ]
          : [
              // @note: Instances created before split of flows between receiver and community wallet
              account.decreaseALEPHFlow(receiver, instanceCosts + EXTRA_WEI),
            ],
      )

      const errors: Error[] = results
        .filter(
          (result): result is PromiseRejectedResult =>
            result.status === 'rejected',
        )
        .filter(({ reason }) => reason.message !== 'No flow to decrease flow')
        .map(({ reason }) => new Error(reason.message))

      if (errors.length) {
        const [firstError] = errors
        throw firstError
      }
    }

    try {
      if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
        throw Err.InvalidAccount

      await this.sdkClient.forget({
        channel: this.channel,
        hashes: [instance.id],
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
    instancesOrIds: string | T | (string | T)[],
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
    instancesOrIds: string | T | (string | T)[],
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

  async getTotalCostByHash(
    paymentMethod: PaymentMethod | PaymentType,
    hash: string,
  ): Promise<number> {
    const costs = await this.sdkClient.instanceClient.getCost(hash)
    return this.parseCost(paymentMethod, Number(costs.cost))
  }

  async getCost(
    newInstance: InstanceCostProps, 
    entityType: EntityType = EntityType.Instance
  ): Promise<InstanceCost> {
    let totalCost = Number.POSITIVE_INFINITY
    const paymentMethod = newInstance.payment?.type || PaymentMethod.Hold

    const parsedInstance: InstancePublishConfiguration =
      await this.parseInstanceForCostEstimation(newInstance)

    const costs =
      await this.sdkClient.instanceClient.getEstimatedCost(parsedInstance)

    totalCost = Number(costs.cost)

    const lines = this.getExecutableCostLines(
      {
        type: entityType,
        ...parsedInstance,
      },
      costs,
    )

    return {
      cost: this.parseCost(paymentMethod, totalCost),
      paymentMethod,
      lines: [...lines],
    }
  }

  async getStreamPaymentDetails(
    instanceOrId: string | T,
    accountOrSuperfluidAccount?: Account | SuperfluidAccount,
  ): Promise<StreamPaymentDetails | undefined> {
    const instance = await this.ensureInstance(instanceOrId)
    if (instance.payment?.type !== PaymentType.superfluid) return

    if (!accountOrSuperfluidAccount) throw Err.ConnectYourPaymentWallet

    const account =
      accountOrSuperfluidAccount instanceof SuperfluidAccount
        ? accountOrSuperfluidAccount
        : await createFromEVMAccount(
            accountOrSuperfluidAccount as EVMAccount,
          ).catch((e) => console.error(e))

    const blockchain = instance.payment.chain as BlockchainId
    const streams: StreamPaymentDetail[] = []

    // @todo: Refactor this
    // @note: Handled in the UI (connect with "chain" to see the streams)
    if (!account) {
      return { blockchain, streams }
    }

    const { receiver } = instance.payment
    if (!receiver) throw Err.ReceiverReward

    const { communityWalletAddress, communityWalletTimestamp } =
      await this.costManager.getSettingsAggregate()

    const instanceCosts = await this.getTotalCostByHash(
      instance.payment?.type,
      instance.id,
    )

    const mainFlow = await account.getALEPHFlow(receiver).catch(() => undefined)
    const isMainFlowActive = mainFlow && mainFlow.gt(0)
    const sender = account.address

    if (instance.time >= communityWalletTimestamp) {
      const communityFlow = await account
        .getALEPHFlow(communityWalletAddress)
        .catch(() => undefined)

      const isCommunityFlowActive = communityFlow && communityFlow.gt(0)

      if (isMainFlowActive) {
        streams.push({
          sender,
          receiver,
          flow: this.calculateReceiverFlow(instanceCosts) + EXTRA_WEI,
        })
      }

      if (isCommunityFlowActive) {
        streams.push({
          sender,
          receiver: communityWalletAddress,
          flow: this.calculateCommunityFlow(instanceCosts) + EXTRA_WEI,
        })
      }
    } else {
      if (isMainFlowActive) {
        streams.push({
          sender,
          receiver,
          flow: instanceCosts + EXTRA_WEI,
        })
      }
    }

    return { blockchain, streams }
  }

  protected async ensureInstance(instanceOrId: string | T): Promise<T> {
    let instance: T | undefined

    if (typeof instanceOrId !== 'string') {
      instance = instanceOrId
      instanceOrId = instance.id
    } else {
      instance = await this.get(instanceOrId)
    }

    if (!instance) throw Err.InstanceNotFound
    return instance
  }

  protected async *addPAYGStreamSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, void, void> {
    if (newInstance.payment?.type !== PaymentMethod.Stream) return
    if (!account) throw Err.ConnectYourWallet
    if (!newInstance.node || !newInstance.node.address) throw Err.InvalidNode

    const { streamCost, streamDuration, receiver } = newInstance.payment

    const { communityWalletAddress } =
      await this.costManager.getSettingsAggregate()

    const costByHour = streamCost / getHours(streamDuration)
    const streamCostByHourToReceiver = this.calculateReceiverFlow(costByHour)
    const streamCostByHourToCommunity = this.calculateCommunityFlow(costByHour)

    const alephxBalance = await account.getALEPHBalance()
    const recieverAlephxFlow = await account.getALEPHFlow(receiver)
    const communityAlephxFlow = await account.getALEPHFlow(
      communityWalletAddress,
    )

    const receiverTotalFlow = recieverAlephxFlow.add(streamCostByHourToReceiver)
    const communityTotalFlow = communityAlephxFlow.add(
      streamCostByHourToCommunity,
    )

    if (
      receiverTotalFlow.greaterThan(100) ||
      communityTotalFlow.greaterThan(100)
    )
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
    await account.increaseALEPHFlow(
      communityWalletAddress,
      streamCostByHourToCommunity + EXTRA_WEI,
    )
    await account.increaseALEPHFlow(
      receiver,
      streamCostByHourToReceiver + EXTRA_WEI,
    )
  }

  protected async parseInstanceForCostEstimation(
    newInstance: AddInstance,
  ): Promise<InstancePublishConfiguration> {
    const { account = mockAccount, channel } = this
    const { specs, image, node, systemVolume } = newInstance

    const rootfs = this.parseRootfs(image, systemVolume)
    const resources = this.parseSpecs(specs)
    const requirements = this.parseRequirements(node)
    const payment = this.parsePaymentForCostEstimation(newInstance.payment)
    const volumes = await this.parseVolumesForCostEstimation(
      newInstance.volumes,
    )

    return {
      account,
      channel,
      resources,
      rootfs,
      volumes,
      payment,
      requirements,
    }
  }

  protected parseRootfs(
    image: InstanceImageField,
    systemVolume: InstanceSystemVolumeField,
  ): RootfsVolumeConfiguration {
    return {
      parent: { ref: image },
      size_mib: systemVolume.size,
    }
  }

  protected async *parseInstanceSteps(
    newInstance: AddInstance,
  ): AsyncGenerator<void, InstancePublishConfiguration, void> {
    if (!this.account) throw Err.InvalidAccount

    const schema = !newInstance.node
      ? InstanceManager.addSchema
      : InstanceManager.addStreamSchema

    newInstance = await schema.parseAsync(newInstance)

    const { account, channel } = this

    const { envVars, specs, image, sshKeys, name, tags, node, systemVolume } =
      newInstance

    const rootfs = this.parseRootfs(image, systemVolume)
    const variables = this.parseEnvVars(envVars)
    const resources = this.parseSpecs(specs)
    const metadata = this.parseMetadata(name, tags)
    const requirements = this.parseRequirements(node)
    const payment = this.parsePayment(newInstance.payment)
    const authorized_keys = yield* this.parseSSHKeysSteps(sshKeys)
    const volumes = yield* this.parseVolumesSteps(newInstance.volumes)

    return {
      account,
      channel,
      variables,
      resources,
      metadata,
      rootfs,
      authorized_keys,
      volumes,
      payment,
      requirements,
    }
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

  protected async parseMessages(messages: any[]): Promise<T[]> {
    return messages.filter(this.parseMessagesFilter).map((message) => {
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

  protected parseMessagesFilter({ content }: any): boolean {
    if (content === undefined) return false

    // Filter out confidential VMs
    if (content.environment?.trusted_execution) return false
    // Filter out GPU instances
    if (content.requirements?.gpu?.length > 0) return false

    return true
  }

  protected calculateCommunityFlow(streamCost: number): number {
    return streamCost * 0.2
  }

  protected calculateReceiverFlow(streamCost: number): number {
    return streamCost * 0.8
  }
}
