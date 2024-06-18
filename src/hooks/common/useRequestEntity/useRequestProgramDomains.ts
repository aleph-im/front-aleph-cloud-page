import { useMemo } from 'react'
import { Domain } from '@/domain/domain'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
} from './useRequestEntities'
import { useRequestDomains } from './useRequestDomains'
import { useAppState } from '@/contexts/appState'
import { Program } from '@/domain/program'

export type UseRequestProgramDomainsProps = Omit<
  UseRequestEntitiesProps<Domain>,
  'name'
>

export type UseRequestProgramDomainsReturn = UseRequestEntitiesReturn<Domain>

export function useRequestProgramDomains(
  props: UseRequestProgramDomainsProps = {},
): UseRequestProgramDomainsReturn {
  const [state] = useAppState()
  const programs = state.program.entities

  const { entities: domains } = useRequestDomains(props)

  const entities = useMemo(() => {
    if (!programs) return []
    if (!domains) return []

    const programsMap = programs.reduce(
      (ac, cv) => {
        ac[cv.id] = cv
        return ac
      },
      {} as Record<string, Program>,
    )

    return domains.filter((domain) => {
      return !!programsMap[domain.ref]
    })
  }, [domains, programs])

  return {
    entities,
  }
}
