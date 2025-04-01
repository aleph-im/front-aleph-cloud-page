import { NodeLastVersions } from '@/domain/node'
import { useNodeManager } from '../../common/useManager/useNodeManager'
import { useAppStoreRequest } from '../useStoreRequest'

export type UseRequestNodeVersionsProps = {
  triggerDeps?: unknown[]
}

export type UseRequestNodeVersionsReturn = {
  ccnLastVersion?: NodeLastVersions
  crnLastVersion?: NodeLastVersions
}

export function useRequestNodeVersions({
  triggerDeps,
}: UseRequestNodeVersionsProps = {}): UseRequestNodeVersionsReturn {
  const nodeManager = useNodeManager()

  const { data: ccnLastVersion } = useAppStoreRequest({
    name: 'lastCCNVersion',
    doRequest: () => nodeManager.getLatestCCNVersion(),
    onSuccess: () => null,
    onError: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  // -----------------------------

  const { data: crnLastVersion } = useAppStoreRequest({
    name: 'lastCRNVersion',
    doRequest: () => nodeManager.getLatestCRNVersion(),
    onSuccess: () => null,
    onError: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps,
  })

  return {
    ccnLastVersion,
    crnLastVersion,
  }
}
