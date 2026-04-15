import { CostsResource } from '@/hooks/common/useServiceCosts'

export type ServiceCostsProps = {
  isConnected: boolean
  costsResources: CostsResource[]
  costsLoading: boolean
}
