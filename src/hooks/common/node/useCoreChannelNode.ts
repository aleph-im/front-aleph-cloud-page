import { useAppState } from '@/contexts/appState'
import { CCN } from '@/domain/node'
import { useMemo } from 'react'

export type UseCoreChannelNodeProps = {
  hash?: string | string[]
}

export type UseCoreChannelNodeReturn = {
  node?: CCN
}

export function useCoreChannelNode({
  hash,
}: UseCoreChannelNodeProps): UseCoreChannelNodeReturn {
  const [state] = useAppState()
  const { entities } = state.ccns

  const nodes = useMemo(() => {
    if (!entities) return
    return entities.filter((node) => node.hash === hash)
  }, [entities, hash])

  const [node] = nodes || []

  return {
    node,
  }
}