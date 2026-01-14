import { useAppState } from '@/contexts/appState'
import { CreditManager } from '@/domain/credit'

export function useCreditManager(): CreditManager | undefined {
  const [appState] = useAppState()
  const { creditManager } = appState.manager

  return creditManager
}
