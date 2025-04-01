import { useAppState } from '@/contexts/appState'
import { CRN } from '@/domain/node'
import { useMemo } from 'react'

export type UseComputeResourceNodeProps = {
  hash?: string | string[]
}

export type UseComputeResourceNodeReturn = {
  node?: CRN
}

export function useComputeResourceNode({
  hash,
}: UseComputeResourceNodeProps): UseComputeResourceNodeReturn {
  const [state] = useAppState()
  const { entities } = state.crns

  const nodes = useMemo(() => {
    if (!entities) return
    return entities.filter((node) => node.hash === hash)
  }, [entities, hash])

  const [node] = nodes || []

  return {
    node,
  }
}