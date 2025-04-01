import { useMemo } from 'react'
import { CCN, CRN, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { useRequest } from '@aleph-front/core'
import { EntitySetAction } from '@/store/entity'

export type UseRequestAlephNodesProps = {
  triggerDeps?: unknown[]
}

export type UseRequestAlephNodesReturn = {
  ccns?: CCN[]
  crns?: CRN[]
}

export function useRequestAlephNodes({
  triggerDeps,
}: UseRequestAlephNodesProps): UseRequestAlephNodesReturn {
  const [state, dispatch] = useAppState()
  const { account } = state.connection
  const { ccns, crns } = state

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const requestState = useMemo(() => {
    return {
      data: {
        ccns: { data: ccns.entities, loading: ccns.loading, error: ccns.error },
        crns: { data: crns.entities, loading: crns.loading, error: crns.error },
        timestamp: Date.now(),
      },
      loading: ccns.loading || crns.loading,
      error: ccns.error || crns.error,
    }
  }, [ccns, crns])

  const { data } = useRequest({
    state: requestState,
    setState: (newState) => {
      const { ccns, crns } = newState.data || {}
      ccns && dispatch(new EntitySetAction({ name: 'ccns', state: ccns }))
      crns && dispatch(new EntitySetAction({ name: 'crns', state: crns }))
    },
    doRequest: async () => {
      const res = await nodeManager.getAllNodes()
      return {
        ccns: { data: res.ccns, loading: false, error: undefined },
        crns: { data: res.crns, loading: false, error: undefined },
        timestamp: Date.now(),
      }
    },
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  return {
    ccns: data?.ccns.data,
    crns: data?.crns.data,
  }
}
