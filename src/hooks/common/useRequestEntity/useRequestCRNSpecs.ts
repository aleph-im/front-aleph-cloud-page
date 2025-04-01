import { useEffect, useState } from 'react'
import { CRN, CRNSpecs } from '@/domain/node'
import { RequestState } from '@aleph-front/core'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type UseRequestCRNSpecsProps = {
  nodes?: CRN[]
}

export type UseRequestCRNSpecsReturn = {
  specs: Record<string, RequestState<CRNSpecs> | CRNSpecs>
  loading: boolean
}

export function useRequestCRNSpecs(
  props?: UseRequestCRNSpecsProps,
): UseRequestCRNSpecsReturn {
  const nodeManager = useNodeManager()
  const { nodes } = props || {}

  const [specs, setSpecs] = useState<
    Record<string, RequestState<CRNSpecs> | CRNSpecs>
  >({})
  const [loading, setLoading] = useState<boolean>(true)

  // Request node-specific specs if nodes are provided
  useEffect(() => {
    if (nodes) {
      async function loadNodeSpecs() {
        await Promise.allSettled(
          nodes.map(async (node) => {
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

      loadNodeSpecs()
    }
  }, [nodeManager, nodes])

  // Request all specs if no nodes are provided
  useEffect(() => {
    if (!nodes) {
      async function loadAllSpecs() {
        const crnSpecs = await nodeManager.getAllCRNsSpecs()

        crnSpecs.forEach((spec) => {
          setSpecs((prev) => ({
            ...prev,
            [spec.hash]: spec,
          }))
        })

        setLoading(false)
      }

      loadAllSpecs()
    }
  }, [nodeManager, nodes])

  return {
    specs,
    loading,
  }
}
