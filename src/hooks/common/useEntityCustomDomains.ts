import { useEffect, useMemo, useState } from 'react'
import { useDomainManager } from './useManager/useDomainManager'
import { DomainWithStatus } from '@/components/common/entityData/EntityCustomDomains/types'
import { useRequestDomains } from './useRequestEntity/useRequestDomains'

export interface UseEntityCustomDomainsProps {
  entityId?: string
}

export interface UseEntityCustomDomainsReturn {
  customDomains: DomainWithStatus[]
  isLoading: boolean
  isLoadingDomains: boolean
  isLoadingDomainStatus: boolean
}

export function useEntityCustomDomains({
  entityId,
}: UseEntityCustomDomainsProps): UseEntityCustomDomainsReturn {
  const domainManager = useDomainManager()

  const { entities: allDomains, loading: isLoadingDomains } =
    useRequestDomains()
  const [customDomains, setCustomDomains] = useState<DomainWithStatus[]>([])
  const [isLoadingDomainStatus, setIsLoadingDomainStatus] =
    useState<boolean>(true)

  const filteredDomains = useMemo(() => {
    if (!entityId) return []
    if (!allDomains) return []

    return allDomains.filter(
      (domain) => domain.ref && entityId.includes(domain.ref),
    ) as DomainWithStatus[]
  }, [entityId, allDomains])

  // Get status for each domain and update customDomains
  useEffect(() => {
    if (!domainManager || filteredDomains.length === 0) {
      setIsLoadingDomainStatus(false)
      return
    }

    const fetchDomainStatuses = async () => {
      try {
        const domainsWithStatus: DomainWithStatus[] = await Promise.all(
          filteredDomains.map(async (domain) => {
            const status = await domainManager.checkStatus(domain)

            return { ...domain, status }
          }),
        )

        setCustomDomains(domainsWithStatus)
      } finally {
        setIsLoadingDomainStatus(false)
      }
    }

    fetchDomainStatuses()

    // Refresh domain statuses periodically
    const intervalId = setInterval(fetchDomainStatuses, 30000) // Every 30 seconds

    return () => clearInterval(intervalId)
  }, [filteredDomains, domainManager])

  return {
    customDomains: customDomains.length ? customDomains : filteredDomains,
    isLoading: isLoadingDomains || isLoadingDomainStatus,
    isLoadingDomains,
    isLoadingDomainStatus,
  }
}

export default useEntityCustomDomains
