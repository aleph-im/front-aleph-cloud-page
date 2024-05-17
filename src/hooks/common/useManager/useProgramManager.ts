import { useAppState } from '@/contexts/appState'
import { ProgramManager } from '@/domain/program'

export function useProgramManager(): ProgramManager | undefined {
  const [appState] = useAppState()
  const { programManager } = appState.manager

  return programManager
}
