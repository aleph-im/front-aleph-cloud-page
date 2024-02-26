import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import {
  UseRequestCRNsReturn,
  useRequestCRNs,
} from '@/hooks/common/useRequestEntity/useRequestCRNs'
import {
  UseRequestCRNSpecsReturn,
  useRequestCRNSpecs,
} from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { getDefaultSpecsOptions } from '@/hooks/form/useSelectInstanceSpecs'
import { useRequestCRNIps } from '@/hooks/common/useRequestEntity/useRequestCRNIps'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import { PaymentMethod } from '@/helpers/constants'
import { CRN, StreamNotSupportedIssue } from '@/domain/node'
import { useDebounceState } from '@aleph-front/core'

export type StreamSupportedIssues = Record<string, StreamNotSupportedIssue>

export type UseNewInstanceCRNListPage = UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn & {
    nodesIssues?: StreamSupportedIssues
    filteredNodes?: CRN[]
    filter: string
    validPAYGNodesOnly: boolean
    handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
    handleValidPAYGNodesOnlyChange: (e: ChangeEvent<HTMLInputElement>) => void
  }

export function useNewInstanceCRNListPage(): UseNewInstanceCRNListPage {
  const { nodes, lastVersion } = useRequestCRNs({})
  const nodeManager = useNodeManager()

  // -----------------------------

  const [filter, setFilter] = useState('')

  const debouncedFilter = useDebounceState(filter, 200)

  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const filter = e.target.value
    setFilter(filter)
  }, [])

  // -----------------------------

  const filterNodes = useCallback(
    (query: string, nodes?: CRN[]): CRN[] | undefined => {
      if (!nodes) return
      if (!query) return nodes

      return nodes.filter((node) =>
        node.name?.toLowerCase().includes(query.toLowerCase()),
      )
    },
    [],
  )

  const baseFilteredNodes = useMemo(
    () => filterNodes(debouncedFilter, nodes),
    [filterNodes, debouncedFilter, nodes],
  )

  // -----------------------------

  const { specs, loading: loading1 } = useRequestCRNSpecs({
    nodes: baseFilteredNodes,
  })
  const { ips, loading: loading2 } = useRequestCRNIps({
    nodes: baseFilteredNodes,
  })

  // -----------------------------

  const minSpecs = useMemo(() => {
    const [min] = getDefaultSpecsOptions(true, PaymentMethod.Stream)
    return min
  }, [])

  const nodesIssues = useMemo(() => {
    if (!baseFilteredNodes) return

    return baseFilteredNodes.reduce((ac, node) => {
      const issue = nodeManager.isStreamPaymentNotSupported(node)

      if (issue) {
        ac[node.hash] = issue
        return ac
      }

      const nodeSpecs = specs[node.hash]?.data

      if (nodeSpecs) {
        const validSpecs = nodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)

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

      if (nodeSpecs && nodeIps) {
        ac[node.hash] = StreamNotSupportedIssue.Valid
      }

      return ac
    }, {} as StreamSupportedIssues)
  }, [baseFilteredNodes, nodeManager, specs, ips, minSpecs])

  // -----------------------------

  const [validPAYGNodesOnly, setValidPAYGNodesOnly] = useState<boolean>(true)

  const handleValidPAYGNodesOnlyChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const show = e.target.checked
      setValidPAYGNodesOnly(show)
    },
    [],
  )

  const validPAYGNodes = useMemo(() => {
    if (!baseFilteredNodes) return
    if (!nodesIssues) return baseFilteredNodes

    return baseFilteredNodes.filter((node) => !nodesIssues[node.hash])
  }, [baseFilteredNodes, nodesIssues])

  const filteredNodes = useMemo(() => {
    if (!validPAYGNodesOnly) return baseFilteredNodes
    return validPAYGNodes
  }, [validPAYGNodesOnly, baseFilteredNodes, validPAYGNodes])

  const sortedNodes = useMemo(() => {
    if (!filteredNodes) return

    return filteredNodes.sort((a, b) => {
      const issueA = nodesIssues?.[a.hash]
      const issueB = nodesIssues?.[b.hash]

      if (issueA && issueB) return 0
      if (issueA) return 1
      return -1
    })
  }, [filteredNodes, nodesIssues])

  const loading = loading1 || loading2

  return {
    nodes,
    lastVersion,
    specs,
    loading,
    nodesIssues,
    filteredNodes: sortedNodes,
    filter,
    validPAYGNodesOnly,
    handleFilterChange,
    handleValidPAYGNodesOnlyChange,
  }
}
