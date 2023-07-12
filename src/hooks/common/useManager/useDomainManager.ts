import { useAppState } from '@/contexts/appState'
import { DomainManager } from '@/domain/domain'

export function useDomainManager(): DomainManager | undefined {
  const [appState] = useAppState()
  const { domainManager } = appState

  return domainManager
}
