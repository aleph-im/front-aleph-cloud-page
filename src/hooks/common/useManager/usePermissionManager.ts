import { useAppState } from '@/contexts/appState'
import { PermissionsManager } from '@/domain/permissions'

export function usePermissionsManager(): PermissionsManager | undefined {
  const [appState] = useAppState()
  const { permissionsManager } = appState.manager

  return permissionsManager
}
