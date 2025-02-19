/* eslint-disable @typescript-eslint/no-unused-vars */
import { Account } from '@aleph-sdk/account'
import {
  GpuProperties,
  HostRequirements,
  Payment,
  PaymentType,
} from '@aleph-sdk/message'
import {
  communityWalletAddress,
  defaultGpuInstanceChannel,
  EntityType,
  EXTRA_WEI,
  PaymentMethod,
} from '@/helpers/constants'
import { ExecutableStatus } from './executable'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainManager } from './domain'
import { CRNSpecs, NodeManager } from './node'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { AddInstance, Instance, InstanceManager } from './instance'
import { SuperfluidAccount } from '@aleph-sdk/superfluid'
import Err from '@/helpers/errors'
import { getHours } from '@/hooks/form/useSelectStreamDuration'
import { CostSummary } from './cost'

export type GpuInstanceStatus = ExecutableStatus | undefined

export type GpuInstanceCostProps = AddInstance
export type GpuInstanceCost = CostSummary

export type GpuInstance = Omit<Instance, 'type'> & {
  type: EntityType.GpuInstance
  payment: Payment & {
    type: PaymentType.superfluid
  }
}

export class GpuInstanceManager extends InstanceManager<GpuInstance> {
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
    super(
      account,
      sdkClient,
      volumeManager,
      domainManager,
      sshKeyManager,
      fileManager,
      nodeManager,
      channel,
    )
  }

  protected override async decreaseFlow(
    account: SuperfluidAccount,
    receiver: string,
    cost: number,
  ): Promise<void> {
    await account.decreaseALEPHFlow(
      receiver,
      this.calculateReceiverFlow(cost) + EXTRA_WEI,
    )

    await account.decreaseALEPHFlow(
      communityWalletAddress,
      this.calculateCommunityFlow(cost) + EXTRA_WEI,
    )
  }

  protected override parseMessagesFilter({ content }: any): boolean {
    if (content === undefined) return false

    return content.requirements?.gpu?.length
  }

  protected override async *addPAYGStreamSteps(
    newInstance: AddInstance,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, void, void> {
    if (newInstance.payment?.type !== PaymentMethod.Stream)
      throw Err.UnsupportedPaymentMethod(newInstance.payment?.type)
    if (!account) throw Err.ConnectYourWallet
    if (!newInstance.node || !newInstance.node.address) throw Err.InvalidNode

    const { streamCost, streamDuration, receiver } = newInstance.payment

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
    await account.increaseALEPHFlow(
      communityWalletAddress,
      streamCostByHourToCommunity + EXTRA_WEI,
    )
    await account.increaseALEPHFlow(
      receiver,
      streamCostByHourToReceiver + EXTRA_WEI,
    )
  }

  protected override parseRequirements(
    node: CRNSpecs,
  ): HostRequirements | undefined {
    const requirements = super.parseRequirements(node)

    console.log('parsing requirements', node, requirements)
    if (!node) return requirements

    const { selectedGpu } = node
    if (!selectedGpu) return requirements

    return {
      ...requirements,
      gpu: [
        {
          vendor: selectedGpu.vendor,
          device_name: selectedGpu.device_name,
          device_class: selectedGpu.device_class,
          device_id: selectedGpu.device_id,
        },
      ],
    }
  }

  protected calculateCommunityFlow(streamCost: number): number {
    return streamCost * 0.2
  }

  protected calculateReceiverFlow(streamCost: number): number {
    return streamCost * 0.8
  }
}
