import { useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
import { EntityManager } from '@/domain/types'
import { EntityType } from '@/helpers/constants'

export function useEntityManager(
  type?: EntityType,
): EntityManager<unknown, unknown> | undefined {
  const [appState] = useAppState()
  const {
    domainManager,
    sshKeyManager,
    volumeManager,
    programManager,
    instanceManager,
    gpuInstanceManager,
    websiteManager,
    confidentialManager,
  } = appState.manager

  const entityMap: Record<
    EntityType,
    EntityManager<unknown, unknown> | undefined
  > = useMemo(() => {
    return {
      [EntityType.Domain]: domainManager,
      [EntityType.SSHKey]: sshKeyManager,
      [EntityType.Volume]: volumeManager,
      [EntityType.Instance]: instanceManager,
      [EntityType.GpuInstance]: gpuInstanceManager,
      [EntityType.Program]: programManager,
      [EntityType.Website]: websiteManager,
      [EntityType.Confidential]: confidentialManager,
    }
  }, [
    domainManager,
    sshKeyManager,
    volumeManager,
    instanceManager,
    gpuInstanceManager,
    programManager,
    websiteManager,
    confidentialManager,
  ])

  if (!type) return
  return entityMap[type]
}
