import { useMemo } from 'react'
import {
  UseRequestCRNsReturn,
  useRequestCRNs,
} from '@/hooks/common/useRequestEntity/useRequestCRNs'
import {
  UseRequestCRNSpecsReturn,
  useRequestCRNSpecs,
} from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import {
  InstanceSpecsField,
  getDefaultSpecsOptions,
} from '@/hooks/form/useSelectInstanceSpecs'

export type UseNewInstanceStreamNodesPage = UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn & {
    minSpecs: InstanceSpecsField
  }

export function useNewInstanceStreamNodesPage(): UseNewInstanceStreamNodesPage {
  const { nodes, lastVersion } = useRequestCRNs({})
  const { specs, loading } = useRequestCRNSpecs({ nodes })

  const minSpecs = useMemo(() => {
    const [min] = getDefaultSpecsOptions(true)
    return min
  }, [])

  const filteredNodes = useMemo(() => {
    return nodes?.filter((node) => {
      const nodeSpecs = specs[node.hash]
      return !nodeSpecs || nodeSpecs.data
    })
  }, [nodes, specs])

  return {
    nodes: filteredNodes,
    lastVersion,
    specs,
    loading,
    minSpecs,
  }
}
