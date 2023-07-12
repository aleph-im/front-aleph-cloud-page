import { useAppState } from '@/contexts/appState'
import { FileManager } from '@/domain/file'

export function useFileManager(): FileManager | undefined {
  const [appState] = useAppState()
  const { fileManager } = appState

  return fileManager
}
