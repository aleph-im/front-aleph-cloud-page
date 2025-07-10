import { useMemo } from 'react'
import { Domain } from '@/domain/domain'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
} from './useRequestEntities'
import { useRequestDomains } from './useRequestDomains'
import { useAppState } from '@/contexts/appState'

export type UseRequestGpuInstanceDomainsProps = Omit<
  UseRequestEntitiesProps<Domain>,
  'name'
>

export type UseRequestGpuInstanceDomainsReturn =
  UseRequestEntitiesReturn<Domain>

export function useRequestGpuInstanceDomains(
  props: UseRequestGpuInstanceDomainsProps = {},
): UseRequestGpuInstanceDomainsReturn {
  const [state] = useAppState()
  const gpuInstances = state.gpuInstance.entities

  const { entities: domains, loading } = useRequestDomains(props)

  const entities = useMemo(() => {
    if (!gpuInstances) return []
    if (!domains) return []

    const gpuInstancesMap = gpuInstances.reduce(
      (ac, cv) => {
        ac[cv.id] = true
        return ac
      },
      {} as Record<string, boolean>,
    )

    return domains.filter((domain) => !!gpuInstancesMap[domain.ref])
  }, [domains, gpuInstances])

  return {
    entities,
    loading,
  }
}
