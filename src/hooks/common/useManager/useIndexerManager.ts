import { useAppState } from '@/contexts/appState'
import { IndexerManager } from '@/domain/indexer'

export function useIndexerManager(): IndexerManager | undefined {
  const [appState] = useAppState()
  const { indexerManager } = appState.manager

  return indexerManager
}
