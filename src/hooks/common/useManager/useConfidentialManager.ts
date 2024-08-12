import { useAppState } from '@/contexts/appState'
import { ConfidentialManager } from '@/domain/confidential'

export function useConfidentialManager(): ConfidentialManager | undefined {
  const [appState] = useAppState()
  const { confidentialManager } = appState.manager

  return confidentialManager
}
