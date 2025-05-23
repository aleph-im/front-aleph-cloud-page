import { useEffect, useState } from 'react'
import { Domain } from '@/domain/domain'
import { useDomainManager } from './useManager/useDomainManager'
import { DomainWithStatus } from '@/components/common/entityData/EntityCustomDomains/types'

export interface UseEntityCustomDomainsProps {
  entityId?: string
}

export interface UseEntityCustomDomainsReturn {
  customDomains: DomainWithStatus[]
  isLoading: boolean
}

export function useEntityCustomDomains({
  entityId,
}: UseEntityCustomDomainsProps): UseEntityCustomDomainsReturn {
  const domainManager = useDomainManager()
  const [domains, setDomains] = useState<Domain[]>([])
  const [customDomains, setCustomDomains] = useState<DomainWithStatus[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch custom domains
  useEffect(() => {
    if (!entityId || !domainManager) {
      setIsLoading(false)
      return
    }

    const getCustomDomains = async () => {
      setIsLoading(true)
      try {
        const allDomains = await domainManager.getAll()
        const filteredDomains = allDomains.filter(
          (domain) => domain.ref && entityId.includes(domain.ref),
        )
        setDomains(filteredDomains)
      } catch (error) {
        console.error('Error fetching domains:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getCustomDomains()
  }, [entityId, domainManager])

  // Get status for each domain and update customDomains
  useEffect(() => {
    if (!domainManager || domains.length === 0) return

    const fetchDomainStatuses = async () => {
      const domainsWithStatus: DomainWithStatus[] = await Promise.all(
        domains.map(async (domain) => {
          const status = await domainManager.checkStatus(domain)
          return {
            domain,
            status,
          }
        }),
      )

      setCustomDomains(domainsWithStatus)
    }

    fetchDomainStatuses()

    // Refresh domain statuses periodically
    const intervalId = setInterval(fetchDomainStatuses, 30000) // Every 30 seconds

    return () => clearInterval(intervalId)
  }, [domains, domainManager])

  return {
    customDomains,
    isLoading,
  }
}

export default useEntityCustomDomains
