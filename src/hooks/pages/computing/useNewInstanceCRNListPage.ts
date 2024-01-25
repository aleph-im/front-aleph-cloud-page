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
import {
  UseRequestCRNIpsReturn,
  useRequestCRNIps,
} from '@/hooks/common/useRequestEntity/useRequestCRNIps'
import { NodeManager } from '@/domain/node'

export type UseNewInstanceCRNListPage = UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn &
  UseRequestCRNIpsReturn & {
    minSpecs: InstanceSpecsField
  }

export function useNewInstanceCRNListPage(): UseNewInstanceCRNListPage {
  const { nodes, lastVersion } = useRequestCRNs({})
  const { specs, loading: loading1 } = useRequestCRNSpecs({ nodes })
  const { ips, loading: loading2 } = useRequestCRNIps({ nodes })

  const nodeManager = useMemo(() => new NodeManager(), [])

  const minSpecs = useMemo(() => {
    const [min] = getDefaultSpecsOptions(true)
    return min
  }, [])

  const filteredNodes = useMemo(() => {
    return nodes
      ?.filter((node) => nodeManager.isStreamPaymentSupported(node))
      ?.filter((node) => {
        const nodeSpecs = specs[node.hash]
        if (!nodeSpecs) return true

        const nodeIps = ips[node.hash]
        if (!nodeIps) return true

        return nodeSpecs.data && nodeIps.data
      })
  }, [nodeManager, nodes, specs, ips])

  const loading = loading1 || loading2

  return {
    nodes: filteredNodes,
    lastVersion,
    specs,
    loading,
    minSpecs,
    ips,
  }
}
