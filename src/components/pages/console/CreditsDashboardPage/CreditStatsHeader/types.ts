import { CostsSummary, CostsResource } from '@/hooks/common/useServiceCosts'

export type CreditStatsHeaderProps = {
  isConnected: boolean
  accountCreditBalance?: number
  costsSummary?: CostsSummary
  costsResources: CostsResource[]
  costsLoading: boolean
}
