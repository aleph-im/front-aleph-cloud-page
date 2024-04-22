import { useAppState } from '@/contexts/appState'
import { WebsiteManager } from '@/domain/website'

export function useWebsiteManager(): WebsiteManager | undefined {
  const [appState] = useAppState()
  const { websiteManager } = appState

  return websiteManager
}
