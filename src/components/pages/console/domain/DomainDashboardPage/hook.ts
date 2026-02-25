import { Domain } from '@/domain/domain'
import { useRequestDomains } from '@/hooks/common/useRequestEntity/useRequestDomains'

export type UseDomainDashboardPageReturn = {
  domains: Domain[]
}

export function useDomainDashboardPage(): UseDomainDashboardPageReturn {
  const { entities: domains = [] } = useRequestDomains()

  return {
    domains,
  }
}
