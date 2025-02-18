import { PaymentMethod } from '@/helpers/constants'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'

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
  InstanceConfidential = 'instance_confidential',
  InstanceGpuPremium = 'instance_gpu_premium',
  InstanceGpuStandard = 'instance_gpu_standard',
  Program = 'program',
  ProgramPersistent = 'program_persistent',
  Storage = 'storage',
  Web3Hosting = 'web3_hosting',
}

export type PriceTypeObject = {
  price: {
    storage: {
      payg: string
      holding: string
    }
    compute_unit: {
      payg: string
      holding: string
    }
  }
  tiers: {
    id: string
    compute_units: number
  }[]
  compute_unit: {
    vcpus: number
    disk_mib: number
    memory_mib: number
  }
}

export const PRICE_AGGREGATE_ADDRESS =
  '0xFba561a84A537fCaa567bb7A2257e7142701ae2A'
export const PRICE_AGGREGATE_KEY = 'pricing'

export class CostManager {
  constructor(
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  async getPricesAggregate(): Promise<Record<string, PriceTypeObject>> {
    return this.sdkClient.fetchAggregate(
      PRICE_AGGREGATE_ADDRESS,
      PRICE_AGGREGATE_KEY,
    )
  }
}
