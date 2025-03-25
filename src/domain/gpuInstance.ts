/* eslint-disable @typescript-eslint/no-unused-vars */
import { Account } from '@aleph-sdk/account'
import { HostRequirements, Payment, PaymentType } from '@aleph-sdk/message'
import { defaultGpuInstanceChannel, EntityType } from '@/helpers/constants'
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
import { CostManager, CostSummary } from './cost'

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
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected sshKeyManager: SSHKeyManager,
    protected fileManager: FileManager,
    protected nodeManager: NodeManager,
    protected costManager: CostManager,
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
      costManager,
      channel,
    )
  }

  protected override parseMessagesFilter({ content }: any): boolean {
    if (content === undefined) return false

    return content.requirements?.gpu?.length
  }

  protected override parseRequirements(
    node: CRNSpecs,
  ): HostRequirements | undefined {
    const requirements = super.parseRequirements(node)

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

  protected override async parseInstanceForCostEstimation(
    newInstance: AddInstance,
  ): Promise<any> {
    // Get the base instance configuration from the parent class
    const baseInstanceConfig = await super.parseInstanceForCostEstimation(
      newInstance,
    )

    // Add GPU requirements if a node with GPU is selected
    if (newInstance.node?.selectedGpu) {
      const gpuRequirements = this.parseRequirements(newInstance.node)
      return {
        ...baseInstanceConfig,
        requirements: gpuRequirements,
      }
    }

    return baseInstanceConfig
  }
}
