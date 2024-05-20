import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { Volume } from '@/domain/volume'
import { useVolumeManager } from '../useManager/useVolumeManager'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'

export type UseRequestVolumesProps = {
  id?: string
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestVolumesReturn = {
  entities?: Volume[]
}

export function useRequestVolumes({
  id,
  triggerDeps = [],
  triggerOnMount = true,
}: UseRequestVolumesProps = {}): UseRequestVolumesReturn {
  const [state] = useAppState()
  const { account } = state.connection
  triggerDeps = [account, ...triggerDeps]

  const manager = useVolumeManager()

  const { data: entities, request } = useAppStoreEntityRequest({
    name: 'volume',
    doRequest: async () => {
      if (!manager) return []

      if (!id) {
        return manager.getAll()
      } else {
        const entity = await manager.get(id)
        return entity ? [entity] : []
      }
    },
    onSuccess: () => null,
    flushData: !id,
    triggerOnMount,
    triggerDeps,
  })

  useRetryNotConfirmedEntities({
    entities,
    request,
    triggerOnMount,
  })

  return {
    entities,
  }
}
