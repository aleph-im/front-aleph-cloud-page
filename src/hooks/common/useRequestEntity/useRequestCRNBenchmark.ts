import { useEffect, useState } from 'react'
import { CRN, CRNBenchmark } from '@/domain/node'
import { RequestState } from '@aleph-front/core'
import { useNodeManager } from '../../common/useManager/useNodeManager'

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
  const nodeManager = useNodeManager()

  const [benchmark, setBenchmark] = useState<
    Record<string, RequestState<CRNBenchmark>>
  >({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
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
