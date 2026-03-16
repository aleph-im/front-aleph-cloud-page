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

export function useRequestCRNSpecs(
  props?: UseRequestCRNSpecsProps,
): UseRequestCRNSpecsReturn {
  const nodeManager = useNodeManager()
  const { nodes } = props || {}

  const [specs, setSpecs] = useState<Record<string, RequestState<CRNSpecs>>>({})
  const [loading, setLoading] = useState<boolean>(true)

  // Request node-specific specs if nodes are provided
  useEffect(() => {
    if (nodes) {
      const loadNodeSpecs = async () => {
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
      const loadAllSpecs = async () => {
        const crnSpecs = await nodeManager.getAllCRNsSpecs()

        // Batch all specs into a single state update to prevent infinite loops
        const newSpecs: Record<string, RequestState<CRNSpecs>> = {}
        crnSpecs.forEach((spec) => {
          newSpecs[spec.hash] = {
            data: spec,
            loading: false,
            error: undefined,
          }
        })

        setSpecs((prev) => ({ ...prev, ...newSpecs }))
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
