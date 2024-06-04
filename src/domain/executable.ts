import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  MachineResources,
  MachineVolume,
  Payment,
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

export abstract class Executable {
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
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

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

    return yield* this.domainManager.addSteps(parsedDomains, 'override')
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
      if (payment.chain === BlockchainId.AVAX)
        return {
          chain: BlockchainId.AVAX,
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
}
