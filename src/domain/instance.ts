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
import { ForwardedPortsManager } from './forwardedPorts'
import { instanceSchema } from '@/helpers/schemas/instance'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
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
  type: EntityType.Instance | EntityType.GpuInstance | EntityType.Confidential
}

export class InstanceManager<T extends InstanceEntity = Instance>
  extends ExecutableManager<T>
  implements EntityManager<T, AddInstance>
{
  static addSchema = instanceSchema

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected sshKeyManager: SSHKeyManager,
    protected fileManager: FileManager,
    protected nodeManager: NodeManager,
    protected costManager: CostManager,
    protected forwardedPortsManager: ForwardedPortsManager,
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
      const instanceMessage = yield* this.parseInstanceSteps(newInstance)

      // @note: Reserve CRN resources before creating PAYG superfluid flows
      // yield* this.addPAYGReservationSteps(newInstance, instanceMessage)

      // @note: Send the instance creation message to the network
      yield

      const response = await this.sdkClient.createInstance({
        ...instanceMessage,
      })
      const [entity] = await this.parseMessages([response])

      // @note: Add the domain link
      yield* this.parseDomainsSteps(entity.id, newInstance.domains)

      // @note: Notify the CRN if it is a targeted stream
      yield* this.addPAYGAllocationSteps(newInstance, entity)

      return entity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async delStreams(
    instanceOrId: string | T,
    account?: SuperfluidAccount,
  ): Promise<void> {
    const instance = await this.ensureInstance(instanceOrId)
    if (instance.payment?.type !== PaymentType.superfluid) return

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

  async delInstance(instanceOrId: string | T): Promise<void> {
    const instance = await this.ensureInstance(instanceOrId)

    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    await this.sdkClient.forget({
      channel: this.channel,
      hashes: [instance.id],
    })
  }

  async del(
    instanceOrId: string | T,
    account?: SuperfluidAccount,
  ): Promise<void> {
    try {
      const instance = await this.ensureInstance(instanceOrId)

      await this.delStreams(instance, account)
      await this.delInstance(instance)

      // Remove forwarded ports for the deleted instance
      try {
        await this.forwardedPortsManager.delByEntityHash(instance.id)
      } catch (err) {
        console.error('Failed to remove forwarded ports for instance:', err)
      }
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async getAddSteps(newInstance: AddInstance): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    const { sshKeys, volumes = [], domains = [] } = newInstance

    const newKeys = this.parseNewSSHKeys(sshKeys)
    // @note: Aggregate all signatures in 1 step
    if (newKeys.length > 0) steps.push('ssh')

    // @note: Aggregate all signatures in 1 step
    if (volumes.length > 0) steps.push('volume')

    // if (newInstance.payment?.type === PaymentMethod.Stream) {
    //   steps.push('reserve')
    // }

    steps.push('instance')

    if (newInstance.payment?.type === PaymentMethod.Stream) {
      steps.push('stream')
    }

    // @note: Aggregate all signatures in 1 step
    if (domains.length > 0) steps.push('domain')

    if (newInstance.payment?.type === PaymentMethod.Stream) {
      steps.push('allocate')
    }

    return steps
  }

  async getDelSteps(
    instancesOrIds: string | T | (string | T)[],
  ): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []

    instancesOrIds = Array.isArray(instancesOrIds)
      ? instancesOrIds
      : [instancesOrIds]

    await Promise.all(
      instancesOrIds.map(async (instanceOrId) => {
        const instance = await this.ensureInstance(instanceOrId)

        if (instance.payment?.type === PaymentType.superfluid) {
          steps.push('streamDel')
        }

        steps.push('instanceDel')
        steps.push('portForwardingDel')
      }),
    )

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
        const instance = await this.ensureInstance(instanceOrId)

        if (instance.payment?.type === PaymentType.superfluid) {
          yield
          await this.delStreams(instance, account)
        }

        yield
        await this.delInstance(instance)

        // Remove forwarded ports for the deleted instance
        yield
        try {
          await this.forwardedPortsManager.delByEntityHash(instance.id)
        } catch (err) {
          console.error('Failed to remove forwarded ports for instance:', err)
        }
      }
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async getCost(
    newInstance: InstanceCostProps,
    entityType:
      | EntityType.Instance
      | EntityType.GpuInstance = EntityType.Instance,
  ): Promise<InstanceCost> {
    let totalCost = Number.POSITIVE_INFINITY
    const paymentMethod = newInstance.payment?.type || PaymentMethod.Credit

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

  protected async *addPAYGReservationSteps(
    newInstance: AddInstance,
    instanceMessage: InstancePublishConfiguration,
  ): AsyncGenerator<void, void, void> {
    if (!newInstance.node || !newInstance.node.address) throw Err.InvalidNode

    yield
    await this.reserveCRNResources(newInstance.node, instanceMessage)
  }

  protected async *addPAYGAllocationSteps(
    newInstance: AddInstance,
    entity: InstanceEntity,
  ): AsyncGenerator<void, void, void> {
    if (!newInstance.node || !newInstance.node.address) throw Err.InvalidNode

    yield
    await this.notifyCRNAllocation(newInstance.node, entity.id, {
      attemps: 10,
      await: 2000,
    })
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

    const schema = InstanceManager.addSchema

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
