import { useMemo } from 'react'
import { NodeLastVersions, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { useAppStoreRequest } from '../useStoreRequest'

export type UseRequestNodeVersionsProps = {
  triggerDeps?: unknown[]
}

export type UseRequestNodeVersionsReturn = {
  ccnLastVersion?: NodeLastVersions
  crnLastVersion?: NodeLastVersions
}

export function useRequestNodeVersions({
  triggerDeps,
}: UseRequestNodeVersionsProps = {}): UseRequestNodeVersionsReturn {
  const [state] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const { data: ccnLastVersion } = useAppStoreRequest({
    name: 'lastCCNVersion',
    doRequest: () => nodeManager.getLatestCCNVersion(),
    onSuccess: () => null,
    onError: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  const { data: crnLastVersion } = useAppStoreRequest({
    name: 'lastCRNVersion',
    doRequest: () => nodeManager.getLatestCRNVersion(),
    onSuccess: () => null,
    onError: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  return {
    ccnLastVersion,
    crnLastVersion,
  }
}