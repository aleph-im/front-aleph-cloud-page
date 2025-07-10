import { useMemo } from 'react'
import { Domain } from '@/domain/domain'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
} from './useRequestEntities'
import { useRequestDomains } from './useRequestDomains'
import { useAppState } from '@/contexts/appState'

export type UseRequestInstanceDomainsProps = Omit<
  UseRequestEntitiesProps<Domain>,
  'name'
>

export type UseRequestInstanceDomainsReturn = UseRequestEntitiesReturn<Domain>

export function useRequestInstanceDomains(
  props: UseRequestInstanceDomainsProps = {},
): UseRequestInstanceDomainsReturn {
  const [state] = useAppState()
  const instances = state.instance.entities

  const { entities: domains, loading } = useRequestDomains(props)

  const entities = useMemo(() => {
    if (!instances) return []
    if (!domains) return []

    const instancesMap = instances.reduce(
      (ac, cv) => {
        ac[cv.id] = true
        return ac
      },
      {} as Record<string, boolean>,
    )

    return domains.filter((domain) => !!instancesMap[domain.ref])
  }, [domains, instances])

  return {
    entities,
    loading,
  }
}
