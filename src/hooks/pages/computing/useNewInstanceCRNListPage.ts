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
  getDefaultSpecsOptions,
  validateMinNodeSpecs,
} from '@/hooks/form/useSelectInstanceSpecs'
import { useRequestCRNIps } from '@/hooks/common/useRequestEntity/useRequestCRNIps'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import { PaymentMethod } from '@/helpers/constants'
import { StreamNotSupportedIssue } from '@/domain/node'

export type StreamSupportedIssues = Record<string, StreamNotSupportedIssue>

export type UseNewInstanceCRNListPage = UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn & {
    nodesIssues?: StreamSupportedIssues
  }

export function useNewInstanceCRNListPage(): UseNewInstanceCRNListPage {
  const { nodes, lastVersion } = useRequestCRNs({})
  const { specs, loading: loading1 } = useRequestCRNSpecs({ nodes })
  const { ips, loading: loading2 } = useRequestCRNIps({ nodes })
  const nodeManager = useNodeManager()

  const minSpecs = useMemo(() => {
    const [min] = getDefaultSpecsOptions(true, PaymentMethod.Stream)
    return min
  }, [])

  const nodesIssues = useMemo(() => {
    if (!nodes) return

    return nodes.reduce((ac, node) => {
      const issue = nodeManager.isStreamPaymentNotSupported(node)

      if (issue) {
        ac[node.hash] = issue
        return ac
      }

      const nodeSpecs = specs[node.hash]?.data

      if (nodeSpecs) {
        const validSpecs = validateMinNodeSpecs(minSpecs, nodeSpecs)

        if (!validSpecs) {
          ac[node.hash] = StreamNotSupportedIssue.MinSpecs
          return ac
        }
      }

      const nodeIps = ips[node.hash]?.data

      if (nodeIps) {
        const validIp = !!nodeIps.vm

        if (!validIp) {
          ac[node.hash] = StreamNotSupportedIssue.IPV6
          return ac
        }
      }

      ac[node.hash] = StreamNotSupportedIssue.Valid
      return ac
    }, {} as StreamSupportedIssues)
  }, [nodes, nodeManager, specs, ips, minSpecs])

  const sortedNodes = useMemo(() => {
    if (!nodes) return

    return nodes.sort((a, b) => {
      const issueA = nodesIssues?.[a.hash]
      const issueB = nodesIssues?.[b.hash]

      if (issueA && issueB) return 0
      if (issueA) return 1
      return -1
    })
  }, [nodes, nodesIssues])

  const loading = loading1 || loading2

  return {
    nodes: sortedNodes,
    lastVersion,
    specs,
    loading,
    nodesIssues,
  }
}
