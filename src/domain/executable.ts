import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  BaseExecutableContent,
  HostRequirements,
  MachineResources,
  MachineVolume,
  Payment,
  PaymentType,
  PaymentType as SDKPaymentType,
} from '@aleph-sdk/message'
import {
  AddExistingVolume,
  AddPersistentVolume,
  VolumeCost,
  VolumeCostProps,
  VolumeManager,
  VolumeType,
} from './volume'
import { Account } from '@aleph-sdk/account'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { Domain, DomainManager } from './domain'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import {
  getHours,
  StreamDurationField,
} from '@/hooks/form/useSelectStreamDuration'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import Err from '@/helpers/errors'
import { BlockchainId } from './connect/base'
import { CRN, NodeManager } from './node'
import { isBlockchainSupported as isBlockchainPAYGCompatible } from '@aleph-sdk/superfluid'

type ExecutableCapabilitiesProps = {
  internetAccess?: boolean
  blockchainRPC?: boolean
  enableSnapshots?: boolean
}

export type ExecutableCostProps = VolumeCostProps & {
  type: EntityType.Instance | EntityType.Program
  isPersistent?: boolean
  paymentMethod?: PaymentMethod
  specs?: InstanceSpecsField
  capabilities?: ExecutableCapabilitiesProps
  streamDuration?: StreamDurationField
}

export type ExecutableCost = Omit<VolumeCost, 'totalCost'> & {
  computeTotalCost: number
  volumeTotalCost: number
  totalCost: number
  totalStreamCost: number
}

export type HoldPaymentConfiguration = {
  chain: BlockchainId
  type: PaymentMethod.Hold
}

export type StreamPaymentConfiguration = {
  chain: BlockchainId
  type: PaymentMethod.Stream
  sender: string
  receiver: string
  streamCost: number
  streamDuration: StreamDurationField
}

export type PaymentConfiguration =
  | HoldPaymentConfiguration
  | StreamPaymentConfiguration

export type Executable = {
  type: EntityType.Instance | EntityType.Program
  id: string // hash
  payment?: BaseExecutableContent['payment']
  //@todo: Add `trusted_execution` field in FunctionEnvironment in ts sdk
  environment?: any
  //@todo: Add `hash` field in NodeRequirements in ts sdk
  requirements?: any
}

export type ExecutableNode = {
  node_id: string
  url: string
  ipv6: string
  supports_ipv6: boolean
}

export type ExecutableStatus = {
  vm_hash: string
  vm_type: EntityType.Instance | EntityType.Program
  vm_ipv6: string
  period: {
    start_timestamp: string
    duration_seconds: number
  }
  node: ExecutableNode
}

export abstract class ExecutableManager {
  /**
   * Calculates the amount of tokens required to deploy a function
   * https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
   */
  static async getExecutableCost({
    type,
    isPersistent,
    specs,
    streamDuration = {
      duration: 1,
      unit: 'h',
    },
    paymentMethod = PaymentMethod.Hold,
    capabilities = {},
    volumes = [],
  }: ExecutableCostProps): Promise<ExecutableCost> {
    if (!specs)
      return {
        computeTotalCost: 0,
        volumeTotalCost: 0,
        perVolumeCost: [],
        totalCost: 0,
        totalStreamCost: 0,
      }

    isPersistent = type === EntityType.Instance ? true : isPersistent

    const basePrice =
      paymentMethod === PaymentMethod.Hold ? (isPersistent ? 2_000 : 200) : 0.11

    const capabilitiesCost = Object.values(capabilities).reduce(
      (ac, cv) => ac + Number(cv),
      1, // @note: baseAlephAPI always included,
    )

    const computeTotalCost = basePrice * specs.cpu * capabilitiesCost

    const sizeDiscount = type === EntityType.Instance ? 0 : specs.storage

    const { perVolumeCost, totalCost: volumeTotalCost } =
      await VolumeManager.getCost({
        volumes,
        sizeDiscount,
        paymentMethod,
        streamDuration,
      })

    const totalCost = volumeTotalCost + computeTotalCost

    const streamCostPerHour =
      paymentMethod === PaymentMethod.Stream && streamDuration
        ? getHours(streamDuration)
        : Number.POSITIVE_INFINITY

    const totalStreamCost = totalCost * streamCostPerHour

    return {
      computeTotalCost,
      perVolumeCost,
      volumeTotalCost,
      totalCost,
      totalStreamCost,
    }
  }

  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected nodeManager: NodeManager,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  async checkStatus(
    executable: Executable,
  ): Promise<ExecutableStatus | undefined> {
    if (executable.payment?.type === PaymentType.superfluid) {
      const receiver = executable.payment?.receiver
      if (!receiver) throw Err.ReceiverReward

      // @todo: refactor this mess
      const node = await this.nodeManager.getCRNByStreamRewardAddress(receiver)
      if (!node) return

      const { address } = node
      if (!address) throw Err.InvalidCRNAddress

      const nodeUrl = address.replace(/\/$/, '')
      const query = await fetch(`${nodeUrl}/about/executions/list`)
      const response = await query.json()

      const status = response[executable.id]
      if (!status) return

      const networking = status['networking']

      return {
        node: {
          node_id: node.hash,
          url: node.address,
          ipv6: networking.ipv6,
          supports_ipv6: true,
        },
        vm_hash: executable.id,
        vm_type: EntityType.Instance,
        vm_ipv6: this.formatVMIPv6Address(networking.ipv6),
        period: {
          start_timestamp: '',
          duration_seconds: 0,
        },
      } as ExecutableStatus
    } else if (executable.environment?.trusted_execution) {
      const crn_hash = executable.requirements?.node?.node_hash
      if (!crn_hash) throw Err.InvalidConfidentialNodeRequirements

      // @todo: refactor this mess
      const node = await this.nodeManager.getCRNByHash(crn_hash)
      if (!node) return

      const { address } = node
      if (!address) throw Err.InvalidCRNAddress

      const nodeUrl = address.replace(/\/$/, '')
      const query = await fetch(`${nodeUrl}/about/executions/list`)
      const response = await query.json()

      const status = response[executable.id]
      if (!status) return

      const networking = status['networking']

      return {
        node: {
          node_id: node.hash,
          url: node.address,
          ipv6: networking.ipv6,
          supports_ipv6: true,
        },
        vm_hash: executable.id,
        vm_type: EntityType.Instance,
        vm_ipv6: this.formatVMIPv6Address(networking.ipv6),
        period: {
          start_timestamp: '',
          duration_seconds: 0,
        },
      } as ExecutableStatus
    }

    const query = await fetch(
      `https://scheduler.api.aleph.sh/api/v0/allocation/${executable.id}`,
    )

    if (query.status === 404) return

    const response = await query.json()
    return response
  }

  protected formatVMIPv6Address(ipv6: string): string {
    // Replace the trailing slash and number
    let newIpv6 = ipv6.replace(/\/\d+$/, '')
    // Replace the last '0' of the IPv6 address with '1'
    newIpv6 = newIpv6.replace(/0(?!.*0)/, '1')
    return newIpv6
  }

  protected parseEnvVars(
    envVars?: EnvVarField[],
  ): Record<string, string> | undefined {
    if (!envVars || envVars.length === 0) return
    return Object.fromEntries(envVars.map(({ name, value }) => [name, value]))
  }

  protected async *parseDomainsSteps(
    ref: string,
    domains?: Omit<DomainField, 'ref'>[],
  ): AsyncGenerator<void, Domain[], void> {
    if (!domains || domains.length === 0) return []

    const parsedDomains = domains.map((domain) => ({
      ...domain,
      ref,
    }))

    return yield* this.domainManager.addSteps(parsedDomains, 'ignore')
  }

  protected async *parseVolumesSteps(
    volumes?: VolumeField | VolumeField[],
  ): AsyncGenerator<void, MachineVolume[] | undefined, void> {
    if (!volumes) return

    volumes = Array.isArray(volumes) ? volumes : [volumes]
    if (volumes.length === 0) return

    // @note: Create new volumes before and cast them to ExistingVolume type
    const messages = yield* this.volumeManager.addSteps(volumes)

    const parsedVolumes: (AddExistingVolume | AddPersistentVolume)[] =
      volumes.map((volume, i) => {
        if (volume.volumeType === VolumeType.New) {
          return {
            ...volume,
            volumeType: VolumeType.Existing,
            refHash: messages[i].id,
          } as AddExistingVolume
        }

        return volume
      })

    // @todo: Fix SDK types (mount is not an string[], remove is_read_only fn)
    return parsedVolumes.map((volume) => {
      if (volume.volumeType === VolumeType.Persistent) {
        const { mountPath: mount, size: size_mib, name } = volume

        return {
          persistence: 'host',
          mount,
          size_mib,
          name,
        }
      }

      const {
        refHash: ref,
        mountPath: mount,
        useLatest: use_latest = false,
      } = volume

      return { ref, mount, use_latest }
    }) as unknown as MachineVolume[]
  }

  protected parseSpecs(
    specs: InstanceSpecsField,
  ): Omit<MachineResources, 'seconds'> {
    return {
      vcpus: specs.cpu,
      memory: specs.ram,
    }
  }

  protected parseMetadata(
    name = 'Untitled',
    tags?: string[],
    metadata?: Record<string, unknown>,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = { name }

    if (tags && tags.length > 0) {
      out.tags = tags
    }

    return {
      ...metadata,
      ...out,
    }
  }

  protected parsePayment(payment?: PaymentConfiguration): Payment {
    if (!payment)
      return {
        chain: BlockchainId.ETH,
        type: SDKPaymentType.hold,
      }
    if (payment.type === PaymentMethod.Stream) {
      if (!payment.receiver) throw Err.ReceivedRequired
      if (isBlockchainPAYGCompatible(payment.chain))
        return {
          chain: payment.chain,
          type: SDKPaymentType.superfluid,
          receiver: payment.receiver,
        }
      throw Err.StreamNotSupported
    }
    return {
      chain: payment.chain,
      type: SDKPaymentType.hold,
    }
  }

  protected parseRequirements(node?: CRN): HostRequirements | undefined {
    if (!node || !node.hash) return
    return {
      node: {
        node_hash: node.hash
      }
    }
  }
}
