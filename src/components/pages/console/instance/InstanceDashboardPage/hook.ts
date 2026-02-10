import { Instance } from '@/domain/instance'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'

export type UseInstanceDashboardPageReturn = {
  instances: Instance[]
}

export function useInstanceDashboardPage(): UseInstanceDashboardPageReturn {
  const { entities: instances = [] } = useRequestInstances()

  return {
    instances,
  }
}
