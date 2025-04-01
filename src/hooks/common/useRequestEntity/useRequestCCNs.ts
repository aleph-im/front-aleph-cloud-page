import { useMemo } from 'react'
import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { CCN, NodeLastVersions, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { useAppStoreRequest } from '../useStoreRequest'

export type UseRequestCCNsProps = {
  triggerDeps?: unknown[]
}

export type UseRequestCCNsReturn = {
  nodes?: CCN[]
  lastVersion?: NodeLastVersions
}

export function useRequestCCNs({
  triggerDeps,
}: UseRequestCCNsProps = {}): UseRequestCCNsReturn {
  const [state] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const { data: nodes } = useAppStoreEntityRequest({
    name: 'ccns',
    doRequest: () => nodeManager.getCCNNodes(),
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  const { data: lastVersion } = useAppStoreRequest({
    name: 'lastCCNVersion',
    doRequest: () => nodeManager.getLatestCCNVersion(),
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