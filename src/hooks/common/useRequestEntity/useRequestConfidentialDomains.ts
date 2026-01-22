import { useMemo } from 'react'
import { Domain } from '@/domain/domain'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
} from './useRequestEntities'
import { useRequestDomains } from './useRequestDomains'
import { useAppState } from '@/contexts/appState'

export type UseRequestConfidentialDomainsProps = Omit<
  UseRequestEntitiesProps<Domain>,
  'name'
>

export type UseRequestConfidentialDomainsReturn = Omit<
  UseRequestEntitiesReturn<Domain>,
  'refetch'
>

export function useRequestConfidentialDomains(
  props: UseRequestConfidentialDomainsProps = {},
): UseRequestConfidentialDomainsReturn {
  const [state] = useAppState()
  const confidentials = state.confidential.entities

  const { entities: domains, loading } = useRequestDomains(props)

  const entities = useMemo(() => {
    if (!confidentials) return []
    if (!domains) return []

    const confidentialsMap = confidentials.reduce(
      (ac, cv) => {
        ac[cv.id] = true
        return ac
      },
      {} as Record<string, boolean>,
    )

    return domains.filter((domain) => !!confidentialsMap[domain.ref])
  }, [domains, confidentials])

  return {
    entities,
    loading,
  }
}
