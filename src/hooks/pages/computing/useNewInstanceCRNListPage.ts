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
  validateMinNodeSpecs,
} from '@/hooks/form/useSelectInstanceSpecs'
import {
  UseRequestCRNIpsReturn,
  useRequestCRNIps,
} from '@/hooks/common/useRequestEntity/useRequestCRNIps'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type UseNewInstanceCRNListPage = UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn &
  UseRequestCRNIpsReturn & {
    minSpecs: InstanceSpecsField
  }

export function useNewInstanceCRNListPage(): UseNewInstanceCRNListPage {
  const { nodes, lastVersion } = useRequestCRNs({})
  const { specs, loading: loading1 } = useRequestCRNSpecs({ nodes })
  const { ips, loading: loading2 } = useRequestCRNIps({ nodes })
  const nodeManager = useNodeManager()

  const minSpecs = useMemo(() => {
    const [min] = getDefaultSpecsOptions(true)
    return min
  }, [])

  const filteredNodes = useMemo(() => {
    return nodes
      ?.filter((node) => nodeManager.isStreamPaymentSupported(node))
      ?.filter((node) => {
        const nodeSpecs = specs[node.hash]
        const nodeIps = ips[node.hash]

        if (nodeSpecs) {
          const validSpecs =
            nodeSpecs?.data && validateMinNodeSpecs(minSpecs, nodeSpecs.data)

          if (!validSpecs) return false
        }

        if (nodeIps) {
          const validIp = !!nodeIps?.data?.vm

          if (!validIp) return false
        }

        return true
      })
  }, [nodes, nodeManager, specs, ips, minSpecs])

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
