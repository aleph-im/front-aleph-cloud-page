import { useAppState } from '@/contexts/appState'
import { SSHKeyManager } from '@/domain/ssh'

export function useSSHKeyManager(): SSHKeyManager | undefined {
  const [appState] = useAppState()
  const { sshKeyManager } = appState

  return sshKeyManager
}
