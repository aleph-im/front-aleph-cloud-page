import { CostsResource } from '@/hooks/common/useServiceCosts'

export type CreditChartsProps = {
  isConnected: boolean
  costsResources: CostsResource[]
  costsLoading: boolean
}

export type DailyChartData = {
  date: string
  expenses: number
  balance: number
}
