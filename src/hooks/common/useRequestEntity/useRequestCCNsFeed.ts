import { useEffect, useMemo, useState } from 'react'
import { CCN, CRN, NodeManager, NodesResponse } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { EntitySetAction } from '@/store/entity'
import { Future } from '@/helpers/utils'

export type UseRequestNodesFeedProps = {
  ccn?: boolean
  crn?: boolean
}

export type UseRequestNodesFeedReturn = {
  nodes?: NodesResponse
}

export function useRequestNodesFeed({
  ccn = true,
  crn = true,
}: UseRequestNodesFeedProps = {}): UseRequestNodesFeedReturn {
  const [state, dispatch] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const manager = useMemo(() => new NodeManager(account), [account])

  // -----------------------------

  const [nodes, setNodes] = useState<NodesResponse>()

  useEffect(() => {
    const abort = new Future<void>()

    async function subscribe() {
      const it = manager.subscribeNodesFeed(abort.promise)

      for await (const data of it) {
        setNodes(data)
      }
    }

    subscribe()

    return () => abort.resolve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!nodes) return

    if (ccn) {
      dispatch(
        new EntitySetAction<CCN>({
          name: 'ccns',
          state: { data: nodes.ccns, loading: false, error: undefined },
        }),
      )
    }

    if (crn) {
      dispatch(
        new EntitySetAction<CRN>({
          name: 'crns',
          state: { data: nodes.crns, loading: false, error: undefined },
        }),
      )
    }
  }, [ccn, crn, dispatch, nodes])

  return { nodes }
}