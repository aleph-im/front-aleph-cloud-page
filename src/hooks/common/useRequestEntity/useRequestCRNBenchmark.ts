import { useEffect, useMemo, useState } from 'react'
import { CRN, CRNBenchmark, NodeManager } from '@/domain/node'
import { RequestState } from '@aleph-front/core'
import { useAppState } from '@/contexts/appState'

export type UseRequestCRNBenchmarkProps = {
  nodes?: CRN[]
}

export type UseRequestCRNBenchmarkReturn = {
  benchmark: Record<string, RequestState<CRNBenchmark>>
  loading: boolean
}

export function useRequestCRNBenchmark({
  nodes,
}: UseRequestCRNBenchmarkProps): UseRequestCRNBenchmarkReturn {
  const [state] = useAppState()
  const { account } = state.connection
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const [benchmark, setBenchmark] = useState<
    Record<string, RequestState<CRNBenchmark>>
  >({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!nodes) return

      await Promise.allSettled(
        nodes.map(async (node) => {
          const nodeSpecs = await nodeManager.getCRNBenchmark(node)

          setBenchmark((prev) => ({
            ...prev,
            [node.hash]: {
              data: nodeSpecs,
              loading: false,
              error: undefined,
            },
          }))
        }),
      )

      setLoading(false)
    }

    load()
  }, [nodeManager, nodes])

  return {
    benchmark,
    loading,
  }
}
