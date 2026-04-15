import { useCallback, useEffect, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { getApiServer } from '@/helpers/server'

export type CostsSummary = {
  total_consumed_credits: number
  total_cost_hold: string
  total_cost_stream: string
  total_cost_credit: string
  resource_count: number
}

export type CostsResource = {
  item_hash: string
  owner: string
  payment_type: string
  consumed_credits: number
  cost_hold: string
  cost_stream: string
  cost_credit: string
  detail: Record<string, unknown> | null
}

export type CostsResponse = {
  summary: CostsSummary
  filters: Record<string, unknown>
  resources: CostsResource[] | null
  pagination_page: number | null
  pagination_total: number | null
  pagination_per_page: number | null
  pagination_item: string | null
}

export type UseServiceCostsReturn = {
  summary?: CostsSummary
  resources: CostsResource[]
  loading: boolean
  error?: Error
  refetch: () => void
}

export function useServiceCosts(): UseServiceCostsReturn {
  const [state] = useAppState()
  const { account } = state.connection

  const [summary, setSummary] = useState<CostsSummary | undefined>()
  const [resources, setResources] = useState<CostsResource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const fetchCosts = useCallback(async () => {
    if (!account?.address) return

    setLoading(true)
    setError(undefined)

    try {
      const apiServer = getApiServer()
      const url = `${apiServer}/api/v0/costs?address=${account.address}&include_details=1&include_size=true`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: CostsResponse = await response.json()
      setSummary(data.summary)
      setResources(data.resources || [])
    } catch (err) {
      console.error('Error fetching service costs:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [account?.address])

  useEffect(() => {
    fetchCosts()
  }, [fetchCosts])

  return {
    summary,
    resources,
    loading,
    error,
    refetch: fetchCosts,
  }
}
