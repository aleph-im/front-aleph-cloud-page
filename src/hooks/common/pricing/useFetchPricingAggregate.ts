import { useEffect, useState } from 'react'
import { useCostManager } from '../useManager/useCostManager'
import { PricingAggregate } from '@/domain/cost'

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

  const costManager = useCostManager()

  useEffect(() => {
    const fetchPricingAggregate = async () => {
      if (!costManager) return

      try {
        setLoading(true)

        const response = await costManager.getPricesAggregate()
        if (!response) return setPricingAggregate(undefined)

        setPricingAggregate(response)
      } catch (e) {
        console.error(e)
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchPricingAggregate()
  }, [costManager])

  return {
    loading,
    error,
    pricingAggregate,
  }
}
