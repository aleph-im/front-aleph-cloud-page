import { useAppState } from '@/contexts/appState'
import { FileManager } from '@/domain/file'

export function useFileManager(): FileManager {
  const [appState] = useAppState()
  const { fileManager } = appState.manager

  return fileManager
}
