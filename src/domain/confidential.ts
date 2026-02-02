/* eslint-disable @typescript-eslint/no-unused-vars */
import { Account } from '@aleph-sdk/account'
import { Payment, PaymentType } from '@aleph-sdk/message'
import {
  CheckoutStepType,
  defaultConfidentialInstanceChannel,
  EntityType,
} from '@/helpers/constants'
import { FileManager } from './file'
import { SSHKeyManager } from './ssh'
import { VolumeManager } from './volume'
import { DomainManager } from './domain'
import { NodeManager } from './node'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { Instance, InstanceManager } from './instance'
import { CostManager } from './cost'
import { ForwardedPortsManager } from './forwardedPorts'
import { SuperfluidAccount } from '@aleph-sdk/superfluid'

export type Confidential = Omit<Instance, 'type'> & {
  type: EntityType.GpuInstance
  payment: Payment & {
    type: PaymentType.superfluid | PaymentType.credit
  }
}

export class ConfidentialManager extends InstanceManager<Confidential> {
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
    protected channel = defaultConfidentialInstanceChannel,
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
      forwardedPortsManager,
      channel,
    )
  }

  add(
    newInstance: unknown,
    account?: SuperfluidAccount,
  ): Promise<Confidential> {
    throw new Error('Method not implemented.')
  }

  del(entityOrId: string | Confidential): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getAddSteps(entity: unknown): Promise<CheckoutStepType[]> {
    throw new Error('Method not implemented.')
  }

  addSteps(
    newInstance: unknown,
    account?: SuperfluidAccount,
  ): AsyncGenerator<void, Confidential, void> {
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

  protected override parseMessagesFilter({ content }: any): boolean {
    if (content === undefined) return false

    // Filter confidential VMs
    return content.environment?.trusted_execution
  }
}
