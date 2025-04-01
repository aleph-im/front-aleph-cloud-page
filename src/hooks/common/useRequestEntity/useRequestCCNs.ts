import { useAppStoreEntityRequest } from '../useStoreEntitiesRequest'
import { CCN, NodeLastVersions } from '@/domain/node'
import { useNodeManager } from '../../common/useManager/useNodeManager'
import { useAppStoreRequest } from '../useStoreRequest'

export type UseRequestCCNsProps = {
  triggerDeps?: unknown[]
}

export type UseRequestCCNsReturn = {
  nodes?: CCN[]
  lastVersion?: NodeLastVersions
}

export function useRequestCCNs({
  triggerDeps,
}: UseRequestCCNsProps = {}): UseRequestCCNsReturn {
  const nodeManager = useNodeManager()

  const { data: nodes } = useAppStoreEntityRequest({
    name: 'ccns',
    doRequest: () => nodeManager.getCCNNodes(),
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  const { data: lastVersion } = useAppStoreRequest({
    name: 'lastCCNVersion',
    doRequest: () => nodeManager.getLatestCCNVersion(),
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
