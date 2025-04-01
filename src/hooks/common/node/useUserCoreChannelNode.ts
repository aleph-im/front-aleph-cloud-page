import { useAppState } from '@/contexts/appState'
import { CCN } from '@/domain/node'
import { useMemo } from 'react'
import { useFilterUserNodes } from './useFilterUserNodes'

export type UseUserCoreChannelNodeProps = {
  nodes?: CCN[]
}

export type UseUserCoreChannelNodeReturn = {
  userNode?: CCN
}

export function useUserCoreChannelNode({
  nodes: prefetchNodes,
}: UseUserCoreChannelNodeProps = {}): UseUserCoreChannelNodeReturn {
  const [state] = useAppState()
  const { entities } = state.ccns
  const nodes = prefetchNodes || entities

  const { userNodes: userCCNNodes } = useFilterUserNodes({ nodes })
  const userNode = useMemo(() => userCCNNodes?.[0], [userCCNNodes])

  return { userNode }
}