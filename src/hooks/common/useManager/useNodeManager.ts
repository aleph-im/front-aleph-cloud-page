import { useAppState } from '@/contexts/appState'
import { NodeManager } from '@/domain/node'

export function useNodeManager(): NodeManager {
  const [appState] = useAppState()
  const { nodeManager } = appState

  return nodeManager
}
