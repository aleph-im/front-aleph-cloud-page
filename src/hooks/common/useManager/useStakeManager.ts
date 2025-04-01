import { useAppState } from '@/contexts/appState'
import { StakeManager } from '@/domain/stake'
import { useMemo } from 'react'

export function useStakeManager(): StakeManager {
  const [appState] = useAppState()
  const { account } = appState.connection

  return useMemo(() => new StakeManager(account), [account])
}
