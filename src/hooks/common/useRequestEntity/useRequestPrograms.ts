import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { Program } from '@/domain/program'
import { useProgramManager } from '../useManager/useProgramManager'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'

export type UseRequestProgramsProps = {
  id?: string
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestProgramsReturn = {
  entities?: Program[]
}

export function useRequestPrograms({
  id,
  triggerDeps = [],
  triggerOnMount = true,
}: UseRequestProgramsProps = {}): UseRequestProgramsReturn {
  const [state] = useAppState()
  const { account } = state.connection
  triggerDeps = [account, ...triggerDeps]

  const manager = useProgramManager()

  const { data: entities, request } = useAppStoreEntityRequest({
    name: 'program',
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
