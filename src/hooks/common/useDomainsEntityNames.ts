import { useMemo } from 'react'
import { EntityDomainType } from '@/helpers/constants'
import { useRequestConfidentials } from '@/hooks/common/useRequestEntity/useRequestConfidentials'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { Domain } from '@/domain/domain'

export type UseDomainsEntityNamesReturn = Map<string, string>

export const useDomainsEntityNames = (
  domains: Domain[],
): UseDomainsEntityNamesReturn => {
  // Group refs by entity type
  const { confidentialRefs, programRefs, instanceRefs } = useMemo(() => {
    const confidentialRefs: string[] = []
    const programRefs: string[] = []
    const instanceRefs: string[] = []

    domains.forEach((domain) => {
      switch (domain.target) {
        case EntityDomainType.Confidential:
          confidentialRefs.push(domain.ref)
          break
        case EntityDomainType.Program:
          programRefs.push(domain.ref)
          break
        case EntityDomainType.Instance:
          instanceRefs.push(domain.ref)
          break
      }
    })

    return {
      confidentialRefs: Array.from(new Set(confidentialRefs)), // Remove duplicates
      programRefs: Array.from(new Set(programRefs)),
      instanceRefs: Array.from(new Set(instanceRefs)),
    }
  }, [domains])

  // Fetch entities in bulk
  const { entities: confidentials } = useRequestConfidentials({
    ids: confidentialRefs.length > 0 ? confidentialRefs : undefined,
  })
  const { entities: programs } = useRequestPrograms({
    ids: programRefs.length > 0 ? programRefs : undefined,
  })
  const { entities: instances } = useRequestInstances({
    ids: instanceRefs.length > 0 ? instanceRefs : undefined,
  })

  // Create lookup map
  return useMemo(() => {
    const entityNames = new Map<string, string>()

    // Add confidential names
    confidentials?.forEach((entity) => {
      if (entity.name) {
        entityNames.set(entity.id, entity.name)
      }
    })

    // Add program names
    programs?.forEach((entity) => {
      if (entity.name) {
        entityNames.set(entity.id, entity.name)
      }
    })

    // Add instance names
    instances?.forEach((entity) => {
      if (entity.name) {
        entityNames.set(entity.id, entity.name)
      }
    })

    return entityNames
  }, [confidentials, programs, instances])
}

export default useDomainsEntityNames
