import { useEffect, useState } from 'react'
import { CRN, CRNSpecs } from '@/domain/node'
import { RequestState } from '@aleph-front/core'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type UseRequestCRNSpecsProps = {
  nodes?: CRN[]
}

export type UseRequestCRNSpecsReturn = {
  specs: Record<string, RequestState<CRNSpecs>>
  loading: boolean
}

export function useRequestCRNSpecs({
  nodes,
}: UseRequestCRNSpecsProps): UseRequestCRNSpecsReturn {
  const nodeManager = useNodeManager()

  const [specs, setSpecs] = useState<Record<string, RequestState<CRNSpecs>>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!nodes) return

      await Promise.allSettled(
        nodes
          .filter((node) => !nodeManager.isStreamPaymentNotSupported(node))
          .map(async (node) => {
            if (specs[node.hash]) return

            setSpecs((prev) => ({
              ...prev,
              [node.hash]: {
                loading: true,
                data: undefined,
                error: undefined,
              },
            }))

            const nodeSpecs = await nodeManager.getCRNspecs(node)

            setSpecs((prev) => ({
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
  }, [nodeManager, nodes, specs])

  // const { data: nodeSpecs } = useLocalRequest({
  //   doRequest: () => nodeManager.getCRNSpecs(nodes || []),
  //   onSuccess: () => null,
  //   flushData: true,
  //   triggerOnMount: true,
  //   triggerDeps: [nodes],
  // })

  return {
    specs,
    loading,
  }
}
