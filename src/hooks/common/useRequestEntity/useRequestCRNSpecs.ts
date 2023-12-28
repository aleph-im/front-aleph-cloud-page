import { useEffect, useMemo, useState } from 'react'
import { CRN, CRNSpecs, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { RequestState } from '@aleph-front/aleph-core'

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
  const [state] = useAppState()
  const { account } = state

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const [specs, setSpecs] = useState<Record<string, RequestState<CRNSpecs>>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!nodes) return

      await Promise.allSettled(
        nodes.map(async (node) => {
          const nodeSpecs = await nodeManager.getCRNspecs(node)

          setSpecs((prev) => ({
            ...prev,
            [node.hash]: { data: nodeSpecs, loading: false, error: undefined },
          }))
        }),
      )

      setLoading(false)
    }

    load()
  }, [nodeManager, nodes])

  // const { data: nodeSpecs } = useLocalRequest({
  //   doRequest: () => nodeManager.getCRNSpecs(nodes || []),
  //   onSuccess: () => null,
  //   flushData: false,
  //   triggerOnMount: true,
  //   triggerDeps: [nodes],
  // })

  return {
    specs,
    loading,
  }
}
