import { useEffect, useMemo, useState } from 'react'
import { CRN, CRNIps, NodeManager } from '@/domain/node'
import { RequestState } from '@aleph-front/core'
import { useAppState } from '@/contexts/appState'

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
  const { account } = state.connection
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const [ips, setIps] = useState<Record<string, RequestState<CRNIps>>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!nodes) return

      await Promise.allSettled(
        nodes
          .filter((node) => !nodeManager.isStreamPaymentNotSupported(node))
          .map(async (node) => {
            if (ips[node.hash]) return

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
  }, [ips, nodeManager, nodes])

  return {
    ips,
    loading,
  }
}
