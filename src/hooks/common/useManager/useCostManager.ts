import { useAppState } from '@/contexts/appState'
import { CostManager } from '@/domain/cost'

export function useCostManager(): CostManager | undefined {
  const [appState] = useAppState()
  const { costManager } = appState.manager

  return costManager
}
