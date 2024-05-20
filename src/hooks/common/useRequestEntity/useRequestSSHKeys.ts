import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { SSHKey } from '@/domain/ssh'
import { useSSHKeyManager } from '../useManager/useSSHKeyManager'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useAppState } from '@/contexts/appState'

export type UseRequestSSHKeysProps = {
  id?: string
  triggerOnMount?: boolean
  triggerDeps?: unknown[]
}

export type UseRequestSSHKeysReturn = {
  entities?: SSHKey[]
}

export function useRequestSSHKeys({
  id,
  triggerDeps = [],
  triggerOnMount = true,
}: UseRequestSSHKeysProps = {}): UseRequestSSHKeysReturn {
  const [state] = useAppState()
  const { account } = state.connection
  triggerDeps = [account, ...triggerDeps]

  const manager = useSSHKeyManager()

  const { data: entities, request } = useAppStoreEntityRequest({
    name: 'ssh',
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
