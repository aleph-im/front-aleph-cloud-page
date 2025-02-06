import {
  apiServer,
  pricingAggregateAddress,
  pricingAggregateKey,
} from '@/helpers/constants'
import { convertKeysToCamelCase } from '@/helpers/utils'
import { AlephHttpClient } from '@aleph-sdk/client'
import { useEffect, useState } from 'react'

export type EntityTier = {
  id: string
  computeUnits: number
}

export type GpuTier = EntityTier & {
  vram: number
  model: string
}

export type ComputeUnitSpecs = {
  vcpus: number
  diskMib: number
  memoryMib: number
}

export type PaymentMethodsPrice = {
  holding?: string
  payg?: string
}

export type Price = {
  fixed?: number
  storage?: PaymentMethodsPrice
  computeUnit?: PaymentMethodsPrice
}

export type PricingAggregate = {
  program: {
    price: Price
    tiers: EntityTier[]
    computeUnit: ComputeUnitSpecs
  }
  programPersistent: {
    price: Price
    tiers: EntityTier[]
    computeUnit: ComputeUnitSpecs
  }
  instance: {
    price: Price
    tiers: EntityTier[]
    computeUnit: ComputeUnitSpecs
  }
  instanceGpuStandard: {
    price: Price
    tiers: GpuTier[]
    computeUnit: ComputeUnitSpecs
  }
  instanceGpuPremium: {
    price: Price
    tiers: GpuTier[]
    computeUnit: ComputeUnitSpecs
  }
  instanceConfidential: {
    price: Price
    tiers: EntityTier[]
    computeUnit: ComputeUnitSpecs
  }
  storage: {
    price: Price
  }
  web3Hosting: {
    price: Price
  }
}

export type UseFetchPricingAggregateReturn = {
  loading: boolean
  error?: Error
  pricingAggregate?: PricingAggregate
}

export default function useFetchPricingAggregate(): UseFetchPricingAggregateReturn {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | undefined>()
  const [pricingAggregate, setPricingAggregate] = useState<
    PricingAggregate | undefined
  >()

  useEffect(() => {
    const fetchPricingAggregate = async () => {
      try {
        setLoading(true)

        const sdkClient = new AlephHttpClient(apiServer)

        const response = await sdkClient.fetchAggregate(
          pricingAggregateAddress,
          pricingAggregateKey,
        )

        if (!response) return setPricingAggregate(undefined)

        const parsedPricingAggregate: PricingAggregate =
          convertKeysToCamelCase(response)

        setPricingAggregate(parsedPricingAggregate)
      } catch (e) {
        console.error(e)
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchPricingAggregate()
  }, [])

  return {
    loading,
    error,
    pricingAggregate,
  }
}
