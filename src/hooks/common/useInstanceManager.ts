import { useAppState } from '@/contexts/appState'
import { InstanceManager } from '@/domain/instance'

export function useInstanceManager(): InstanceManager | undefined {
  const [appState] = useAppState()
  const { instanceManager } = appState

  return instanceManager
}
