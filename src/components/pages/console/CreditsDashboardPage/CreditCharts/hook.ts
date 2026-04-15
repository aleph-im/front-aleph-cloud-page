import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppState } from '@/contexts/appState'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { CostsResource } from '@/hooks/common/useServiceCosts'
import { CreditHistoryEntry } from '@/hooks/common/useCreditHistory'
import { getApiServer } from '@/helpers/server'
import { DailyChartData } from './types'

const CHART_GRADIENT_KEYS = ['main0', 'main1', 'info', 'success', 'warning']

export type PieChartEntry = {
  label: string
  value: number
  gradient?: string
  color?: string
}

export type UseCreditChartsReturn = {
  serviceTypePieData: PieChartEntry[]
  expenseSharePieData: PieChartEntry[]
  dailyChartData: DailyChartData[]
  chartLoading: boolean
}

export function useCreditCharts(
  costsResources: CostsResource[],
): UseCreditChartsReturn {
  const [state] = useAppState()
  const { account, creditBalance } = state.connection
  const { instances, gpuInstances, confidentials, volumes, websites } =
    useAccountEntities()

  const [dailyChartData, setDailyChartData] = useState<DailyChartData[]>([])
  const [chartLoading, setChartLoading] = useState(false)

  // Build a map from item_hash to entity type
  const entityTypeMap = useMemo(() => {
    const map = new Map<string, string>()
    instances.forEach((e) => map.set(e.id, 'Instance'))
    gpuInstances.forEach((e) => map.set(e.id, 'GPU'))
    confidentials.forEach((e) => map.set(e.id, 'Confidential'))
    volumes.forEach((e) => map.set(e.id, 'Volume'))
    websites.forEach((e) => map.set(e.id, 'Website'))
    return map
  }, [instances, gpuInstances, confidentials, volumes, websites])

  // Pie chart: service type distribution
  const serviceTypePieData = useMemo(() => {
    const typeCounts: Record<string, number> = {}

    costsResources.forEach((r) => {
      const type = entityTypeMap.get(r.item_hash) || 'Other'
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    return Object.entries(typeCounts).map(([label, value], i) => ({
      label,
      value,
      gradient: CHART_GRADIENT_KEYS[i % CHART_GRADIENT_KEYS.length],
    }))
  }, [costsResources, entityTypeMap])

  // Pie chart: expense share by resource
  const expenseSharePieData = useMemo(() => {
    return costsResources
      .filter((r) => r.consumed_credits > 0)
      .sort((a, b) => b.consumed_credits - a.consumed_credits)
      .slice(0, 8)
      .map((r, i) => {
        const type = entityTypeMap.get(r.item_hash) || 'Unknown'
        const shortHash = r.item_hash.slice(0, 8)
        return {
          label: `${type} (${shortHash})`,
          value: r.consumed_credits,
          gradient: CHART_GRADIENT_KEYS[i % CHART_GRADIENT_KEYS.length],
        }
      })
  }, [costsResources, entityTypeMap])

  // 30-day line chart: fetch and aggregate credit history
  const fetchDailyData = useCallback(async () => {
    if (!account?.address) return

    setChartLoading(true)
    try {
      const apiServer = getApiServer()
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const allEntries: CreditHistoryEntry[] = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        const params = new URLSearchParams({
          pagination: '200',
          page: String(page),
        })

        const response = await fetch(
          `${apiServer}/api/v0/addresses/${account.address}/credit_history?${params}`,
        )

        if (!response.ok) break

        const data = await response.json()
        const entries: CreditHistoryEntry[] = data.credit_history || []

        if (entries.length === 0) {
          hasMore = false
          break
        }

        // Check if we've gone past 30 days
        const oldestEntry = entries[entries.length - 1]
        const oldestDate = new Date(oldestEntry.message_timestamp)

        allEntries.push(
          ...entries.filter(
            (e) => new Date(e.message_timestamp) >= thirtyDaysAgo,
          ),
        )

        if (oldestDate < thirtyDaysAgo) {
          hasMore = false
        } else {
          page++
        }
      }

      // Aggregate by day
      const dailyMap = new Map<string, { expenses: number; income: number }>()

      // Initialize all 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        dailyMap.set(key, { expenses: 0, income: 0 })
      }

      allEntries.forEach((entry) => {
        const dateKey = entry.message_timestamp.split('T')[0]
        const existing = dailyMap.get(dateKey)
        if (existing) {
          if (entry.amount < 0) {
            existing.expenses += Math.abs(entry.amount)
          } else {
            existing.income += entry.amount
          }
        }
      })

      // Build chart data with running balance
      const currentBalance = creditBalance || 0
      const chartEntries: DailyChartData[] = []
      const sortedDays = Array.from(dailyMap.entries()).sort(([a], [b]) =>
        a.localeCompare(b),
      )

      // Calculate balance for each day by working backwards
      let runningBalance = currentBalance
      const balanceByDay = new Map<string, number>()

      for (let i = sortedDays.length - 1; i >= 0; i--) {
        const [dateKey, data] = sortedDays[i]
        balanceByDay.set(dateKey, runningBalance)
        runningBalance = runningBalance + data.expenses - data.income
      }

      sortedDays.forEach(([dateKey, data]) => {
        chartEntries.push({
          date: dateKey,
          expenses: data.expenses,
          balance: balanceByDay.get(dateKey) || 0,
        })
      })

      setDailyChartData(chartEntries)
    } catch (err) {
      console.error('Error fetching chart data:', err)
    } finally {
      setChartLoading(false)
    }
  }, [account?.address, creditBalance])

  useEffect(() => {
    fetchDailyData()
  }, [fetchDailyData])

  return {
    serviceTypePieData,
    expenseSharePieData,
    dailyChartData,
    chartLoading,
  }
}
