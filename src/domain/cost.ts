import {
  PaymentMethod,
  pricingAggregateAddress,
  pricingAggregateKey,
} from '@/helpers/constants'
import { convertKeysToCamelCase } from '@/helpers/utils'
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
    }
    compute_unit: {
      payg: string
      holding: string
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

export class CostManager {
  constructor(
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  async getPricesAggregate(): Promise<PricingAggregate> {
    const response = await this.sdkClient.fetchAggregate(
      pricingAggregateAddress,
      pricingAggregateKey,
    )

    return convertKeysToCamelCase(response)
  }
}
