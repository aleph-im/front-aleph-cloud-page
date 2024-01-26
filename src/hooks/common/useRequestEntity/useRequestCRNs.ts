import { CRN, NodeLastVersions } from '@/domain/node'
import { useLocalRequest } from '@aleph-front/core'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type UseRequestCRNsProps = {
  triggerDeps?: unknown[]
}

export type UseRequestCRNsReturn = {
  nodes?: CRN[]
  lastVersion?: NodeLastVersions
}

export function useRequestCRNs({
  triggerDeps,
}: UseRequestCRNsProps): UseRequestCRNsReturn {
  const nodeManager = useNodeManager()

  const { data: nodes } = useLocalRequest({
    doRequest: () => nodeManager.getCRNNodes(),
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  const { data: lastVersion } = useLocalRequest({
    doRequest: () => nodeManager.getLatestCRNVersion(),
    onSuccess: () => null,
    onError: () => null,
    flushData: false,
    triggerOnMount: true,
  })

  return {
    nodes,
    lastVersion,
  }
}
