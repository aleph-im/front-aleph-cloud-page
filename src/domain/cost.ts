import { PaymentMethod } from '@/helpers/constants'
import { convertKeysToCamelCase } from '@/helpers/utils'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { GPUDevice } from './node'

// type ExecutableCapabilitiesProps = {
//   internetAccess?: boolean
//   blockchainRPC?: boolean
//   enableSnapshots?: boolean
// }

// export type CostPropsResult = {
//   type: EntityType.Instance | EntityType.Program
//   isPersistent?: boolean
//   paymentMethod?: PaymentMethod
//   specs?: InstanceSpecsField
//   capabilities?: ExecutableCapabilitiesProps
//   streamDuration?: StreamDurationField
//   volumes?: (Volume | AddVolume)[]
//   domains?: DomainField[]
// }

// export type VolumeCost = {
//   perVolumeCost: PerVolumeCost
//   totalCost: number
//   totalStreamCost: number
// }

export type CostLine = {
  id: string
  name: string
  label?: string
  detail: string
  cost: number
}

export type CostSummary = {
  paymentMethod: PaymentMethod
  cost: number
  lines: CostLine[]
}

export enum PriceType {
  Instance = 'instance',
  InstanceConfidential = 'instanceConfidential',
  InstanceGpuPremium = 'instanceGpuPremium',
  InstanceGpuStandard = 'instanceGpuStandard',
  Program = 'program',
  ProgramPersistent = 'programPersistent',
  Storage = 'storage',
  Web3Hosting = 'web3Hosting',
}

export type PriceTypeObject = {
  price: {
    storage: {
      payg: string
      holding: string
      credit: string
    }
    computeUnit: {
      payg: string
      holding: string
      credit: string
    }
  }
  tiers: {
    id: string
    computeUnits: number
    model: string
  }[]
  computeUnit: {
    vcpus: number
    diskMib: number
    memoryMib: number
  }
}

export type PricingAggregate = Record<PriceType, PriceTypeObject>

export type SettingsAggregate = {
  compatibleGpus: GPUDevice[]
  lastCrnVersion: string
  communityWalletAddress: string
  communityWalletTimestamp: number
}

export class CostManager {
  constructor(
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  protected static readonly aggregateSourceAddress =
    // '0xFba561a84A537fCaa567bb7A2257e7142701ae2A'
    '0xA07B1214bAe0D5ccAA25449C3149c0aC83658874'

  async getSettingsAggregate(): Promise<SettingsAggregate> {
    const response = await this.sdkClient.fetchAggregate(
      CostManager.aggregateSourceAddress,
      'settings',
    )

    return convertKeysToCamelCase(response)
  }

  async getPricesAggregate(): Promise<PricingAggregate> {
    const response = await this.sdkClient.fetchAggregate(
      CostManager.aggregateSourceAddress,
      'pricing',
    )

    return convertKeysToCamelCase(response)
  }
}
