import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDomainManager } from './useManager/useDomainManager'
import { DomainWithStatus } from '@/components/common/entityData/EntityCustomDomains/types'
import { useRequestDomains } from './useRequestEntity/useRequestDomains'
import { EntityDomainType } from '@/helpers/constants'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import { useAppState } from '@/contexts/appState'

export interface UseEntityCustomDomainsProps {
  entityId?: string
  entityType: EntityDomainType
}

export interface UseEntityCustomDomainsReturn {
  customDomains: DomainWithStatus[]
  isLoading: boolean
  isLoadingDomains: boolean
  isLoadingDomainStatus: boolean
  refetchDomains: () => Promise<void>
  createDomain: (name: string) => Promise<void>
}

export function useEntityCustomDomains({
  entityId,
  entityType,
}: UseEntityCustomDomainsProps): UseEntityCustomDomainsReturn {
  const [, dispatch] = useAppState()
  const domainManager = useDomainManager()
  const { next, stop } = useCheckoutNotification()

  const {
    entities: allDomains,
    loading: isLoadingDomains,
    refetch: refetchDomains,
  } = useRequestDomains()
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

  const createDomain = useCallback(
    async (name: string) => {
      if (!domainManager) throw new Error('Connect your wallet')
      if (!entityId) throw new Error('Entity ID is required')

      const domainData = {
        name,
        target: entityType,
        ref: entityId,
      }

      const iSteps = await domainManager.getAddSteps(domainData, 'override')
      const nSteps = iSteps.map((i) => stepsCatalog[i])
      const steps = domainManager.addSteps(domainData, 'override')

      try {
        let accountDomain

        while (!accountDomain) {
          const { value, done } = await steps.next()

          if (done) {
            accountDomain = value[0]
            break
          }

          await next(nSteps)
        }

        dispatch(
          new EntityAddAction({
            name: 'domain',
            entities: accountDomain,
          }),
        )

        await refetchDomains()
      } finally {
        await stop()
      }
    },
    [domainManager, entityId, entityType, next, stop, dispatch, refetchDomains],
  )

  return {
    customDomains: customDomains.length ? customDomains : filteredDomains,
    isLoading: isLoadingDomains || isLoadingDomainStatus,
    isLoadingDomains,
    isLoadingDomainStatus,
    refetchDomains,
    createDomain,
  }
}

export default useEntityCustomDomains
