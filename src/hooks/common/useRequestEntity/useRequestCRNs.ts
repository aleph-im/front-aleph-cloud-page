import { useMemo } from 'react'
import { CRN, NodeLastVersions, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { useLocalRequest } from '@aleph-front/core'

export type UseRequestCRNsProps = {
  triggerDeps?: unknown[]
}

export type UseRequestCRNsReturn = {
  nodes?: CRN[]
  lastVersion?: NodeLastVersions
}

export function useRequestCRNs({
  triggerDeps,
}: UseRequestCRNsProps): UseRequestCRNsReturn {
  const [state] = useAppState()
  const { account } = state

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const { data: nodes } = useLocalRequest({
    doRequest: () => nodeManager.getCRNNodes(),
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  const { data: lastVersion } = useLocalRequest({
    doRequest: () => nodeManager.getLatestCRNVersion(),
    onSuccess: () => null,
    onError: () => null,
    flushData: false,
    triggerOnMount: true,
  })

  return {
    nodes,
    lastVersion,
  }
}
