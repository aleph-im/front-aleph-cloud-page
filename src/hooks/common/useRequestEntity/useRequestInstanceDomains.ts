import { useMemo } from 'react'
import { Domain } from '@/domain/domain'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
} from './useRequestEntities'
import { useRequestDomains } from './useRequestDomains'
import { useAppState } from '@/contexts/appState'
import { Instance } from '@/domain/instance'

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

  const { entities: domains } = useRequestDomains(props)

  const entities = useMemo(() => {
    if (!instances) return []
    if (!domains) return []

    const instancesMap = instances.reduce(
      (ac, cv) => {
        ac[cv.id] = cv
        return ac
      },
      {} as Record<string, Instance>,
    )

    return domains.filter((domain) => {
      return !!instancesMap[domain.ref]
    })
  }, [domains, instances])

  return {
    entities,
  }
}
