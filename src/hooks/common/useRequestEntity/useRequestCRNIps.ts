import { useEffect, useMemo, useState } from 'react'
import { CRN, CRNIps, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { RequestState } from '@aleph-front/core'

export type UseRequestCRNIpsProps = {
  nodes?: CRN[]
}

export type UseRequestCRNIpsReturn = {
  ips: Record<string, RequestState<CRNIps>>
  loading: boolean
}

export function useRequestCRNIps({
  nodes,
}: UseRequestCRNIpsProps): UseRequestCRNIpsReturn {
  const [state] = useAppState()
  const { account } = state

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const [ips, setIps] = useState<Record<string, RequestState<CRNIps>>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!nodes) return

      await Promise.allSettled(
        nodes
          .filter((node) => nodeManager.isStreamPaymentSupported(node))
          .map(async (node) => {
            const nodeSpecs = await nodeManager.getCRNips(node)

            setIps((prev) => ({
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

  // const { data: nodeSpecs } = useLocalRequest({
  //   doRequest: () => nodeManager.getCRNIps(nodes || []),
  //   onSuccess: () => null,
  //   flushData: false,
  //   triggerOnMount: true,
  //   triggerDeps: [nodes],
  // })

  return {
    ips,
    loading,
  }
}
