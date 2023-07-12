import { useAppState } from '@/contexts/appState'
import { VolumeManager } from '@/domain/volume'

export function useVolumeManager(): VolumeManager | undefined {
  const [appState] = useAppState()
  const { volumeManager } = appState

  return volumeManager
}
