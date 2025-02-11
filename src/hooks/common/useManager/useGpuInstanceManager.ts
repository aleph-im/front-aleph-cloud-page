import { useAppState } from '@/contexts/appState'
import { GpuInstanceManager } from '@/domain/gpuInstance'

export function useGpuInstanceManager(): GpuInstanceManager | undefined {
  const [appState] = useAppState()
  const { gpuInstanceManager } = appState.manager

  return gpuInstanceManager
}
