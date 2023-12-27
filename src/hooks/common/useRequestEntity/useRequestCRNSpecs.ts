import { useMemo } from 'react'
import { CRN, CRNSpecs, NodeManager } from '@/domain/node'
import { useAppState } from '@/contexts/appState'
import { useLocalRequest } from '@aleph-front/aleph-core'

export type UseRequestCRNSpecsProps = {
  nodes?: CRN[]
}

export type UseRequestCRNSpecsReturn = {
  specs?: Record<string, CRNSpecs>
}

export function useRequestCRNSpecs({
  nodes,
}: UseRequestCRNSpecsProps): UseRequestCRNSpecsReturn {
  const [state] = useAppState()
  const { account } = state

  // @todo: Refactor this (use singleton)
  const nodeManager = useMemo(() => new NodeManager(account), [account])

  const { data: nodeSpecs } = useLocalRequest({
    doRequest: () => nodeManager.getCRNSpecs(nodes || []),
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps: [nodes],
  })

  const specs = useMemo(() => {
    if (!nodeSpecs) return

    return nodeSpecs.reduce((ac, cv) => {
      ac[cv.hash] = cv
      return ac
    }, {} as Record<string, CRNSpecs>)
  }, [nodeSpecs])

  return {
    specs,
  }
}
