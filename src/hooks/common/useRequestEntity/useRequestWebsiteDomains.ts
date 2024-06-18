import { useMemo } from 'react'
import { Domain } from '@/domain/domain'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
} from './useRequestEntities'
import { useRequestDomains } from './useRequestDomains'
import { useAppState } from '@/contexts/appState'
import { Website } from '@/domain/website'

export type UseRequestWebsiteDomainsProps = Omit<
  UseRequestEntitiesProps<Domain>,
  'name'
>

export type UseRequestWebsiteDomainsReturn = UseRequestEntitiesReturn<Domain>

export function useRequestWebsiteDomains(
  props: UseRequestWebsiteDomainsProps = {},
): UseRequestWebsiteDomainsReturn {
  const [state] = useAppState()
  const websites = state.website.entities

  const { entities: domains } = useRequestDomains(props)

  const entities = useMemo(() => {
    if (!websites) return []
    if (!domains) return []

    const websitesMap = websites.reduce(
      (ac, cv) => {
        ac[cv.id] = cv
        return ac
      },
      {} as Record<string, Website>,
    )

    return domains.filter((domain) => {
      return !!websitesMap[domain.ref]
    })
  }, [domains, websites])

  return {
    entities,
  }
}
