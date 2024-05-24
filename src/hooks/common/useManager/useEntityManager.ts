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
    indexerManager,
    websiteManager,
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
      [EntityType.Program]: programManager,
      [EntityType.Indexer]: indexerManager,
      [EntityType.Website]: websiteManager,
    }
  }, [
    domainManager,
    instanceManager,
    programManager,
    sshKeyManager,
    volumeManager,
    indexerManager,
    websiteManager,
  ])

  if (!type) return
  return entityMap[type]
}
