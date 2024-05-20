import { useAppState } from '@/contexts/appState'
import { MessageManager } from '@/domain/message'

export function useMessageManager(): MessageManager | undefined {
  const [appState] = useAppState()
  const { messageManager } = appState.manager

  return messageManager
}
