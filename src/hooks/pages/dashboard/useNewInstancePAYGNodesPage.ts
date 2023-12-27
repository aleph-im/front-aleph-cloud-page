import useConnectedWard from '@/hooks/common/useConnectedWard'
import {
  UseRequestCRNsReturn,
  useRequestCRNs,
} from '@/hooks/common/useRequestEntity/useRequestCRNs'
import {
  UseRequestCRNSpecsReturn,
  useRequestCRNSpecs,
} from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'

export type UseNewInstancePAYGNodesPage = UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn

export function useNewInstancePAYGNodesPage(): UseNewInstancePAYGNodesPage {
  useConnectedWard()

  const { nodes, lastVersion } = useRequestCRNs({})
  const { specs } = useRequestCRNSpecs({ nodes })

  return {
    nodes,
    lastVersion,
    specs,
  }
}
