import { useAppState } from '@/contexts/appState'
import { ForwardedPortsManager } from '@/domain/forwardedPorts'

export function useForwardedPortsManager(): ForwardedPortsManager | undefined {
  const [appState] = useAppState()
  const { forwardedPortsManager } = appState.manager

  return forwardedPortsManager
}
