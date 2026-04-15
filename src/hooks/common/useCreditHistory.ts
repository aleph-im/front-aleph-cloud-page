import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { getApiServer } from '@/helpers/server'

export type CreditHistoryEntry = {
  amount: number
  price: string | null
  bonus_amount: number | null
  tx_hash: string | null
  token: string | null
  chain: string | null
  provider: string
  origin: string
  origin_ref: string | null
  payment_method: string
  credit_ref: string
  credit_index: number
  expiration_date: string | null
  message_timestamp: string
}

export type CreditHistoryFilters = {
  payment_method?: string
  search?: string
}

export type CreditHistorySortField =
  | 'message_timestamp'
  | 'amount'
  | 'payment_method'
  | 'expiration_date'
  | 'origin'

export type CreditHistorySort = {
  field: CreditHistorySortField
  direction: 'asc' | 'desc'
}

export type UseCreditHistoryReturn = {
  entries: CreditHistoryEntry[]
  filteredEntries: CreditHistoryEntry[]
  loading: boolean
  error?: Error
  page: number
  setPage: (page: number) => void
  totalPages: number
  totalEntries: number
  filters: CreditHistoryFilters
  setFilters: (filters: CreditHistoryFilters) => void
  sort: CreditHistorySort
  setSort: (sort: CreditHistorySort) => void
  refetch: () => void
}

const PAGE_SIZE = 50

export function useCreditHistory(): UseCreditHistoryReturn {
  const [state] = useAppState()
  const { account } = state.connection

  const [entries, setEntries] = useState<CreditHistoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const [page, setPage] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [filters, setFilters] = useState<CreditHistoryFilters>({})
  const [sort, setSort] = useState<CreditHistorySort>({
    field: 'message_timestamp',
    direction: 'desc',
  })

  const fetchHistory = useCallback(async () => {
    if (!account?.address) return

    setLoading(true)
    setError(undefined)

    try {
      const apiServer = getApiServer()
      const params = new URLSearchParams({
        pagination: String(PAGE_SIZE),
        page: String(page),
      })

      if (filters.payment_method) {
        params.set('payment_method', filters.payment_method)
      }

      const url = `${apiServer}/api/v0/addresses/${account.address}/credit_history?${params}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setEntries(data.credit_history || [])
      setTotalEntries(data.pagination_total || 0)
    } catch (err) {
      console.error('Error fetching credit history:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [account?.address, page, filters.payment_method])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Client-side search across all fields
  const searchFilteredEntries = useMemo(() => {
    if (!filters.search) return entries

    const query = filters.search.toLowerCase()
    return entries.filter((entry) => {
      const fields = [
        String(entry.amount),
        entry.origin,
        entry.origin_ref,
        entry.tx_hash,
        entry.credit_ref,
        entry.payment_method,
        entry.provider,
        entry.chain,
        entry.token,
        entry.message_timestamp,
        entry.price,
        entry.expiration_date,
      ]
      return fields.some((f) => f && f.toLowerCase().includes(query))
    })
  }, [entries, filters.search])

  // Client-side sorting
  const filteredEntries = useMemo(() => {
    const sorted = [...searchFilteredEntries]

    sorted.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1

      switch (sort.field) {
        case 'message_timestamp':
          return (
            dir *
            (new Date(a.message_timestamp).getTime() -
              new Date(b.message_timestamp).getTime())
          )
        case 'amount':
          return dir * (a.amount - b.amount)
        case 'payment_method':
          return dir * a.payment_method.localeCompare(b.payment_method)
        case 'expiration_date': {
          const aDate = a.expiration_date
            ? new Date(a.expiration_date).getTime()
            : 0
          const bDate = b.expiration_date
            ? new Date(b.expiration_date).getTime()
            : 0
          return dir * (aDate - bDate)
        }
        case 'origin':
          return dir * a.origin.localeCompare(b.origin)
        default:
          return 0
      }
    })

    return sorted
  }, [searchFilteredEntries, sort])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalEntries / PAGE_SIZE)),
    [totalEntries],
  )

  return {
    entries,
    filteredEntries,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalEntries,
    filters,
    setFilters,
    sort,
    setSort,
    refetch: fetchHistory,
  }
}
