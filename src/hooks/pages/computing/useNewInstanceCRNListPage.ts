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
import { useDebounceState, usePaginatedList } from '@aleph-front/core'
import {
  UseSortedListReturn,
  useSortedList,
} from '@/hooks/common/useSortedList'

export type StreamSupportedIssues = Record<string, StreamNotSupportedIssue>

export type UseNewInstanceCRNListPage = UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn & {
    nodesIssues?: StreamSupportedIssues
    filteredNodes?: CRN[]
    filter: string
    validPAYGNodesOnly: boolean
    loadItemsDisabled: boolean
    handleLoadItems: () => Promise<void>
    handleSortItems: UseSortedListReturn<any>['handleSortItems']
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

  const { specs, loading: loadingSpecs } = useRequestCRNSpecs({
    nodes: baseFilteredNodes,
  })

  const { ips, loading: loadingIps } = useRequestCRNIps({
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

      if (loadingSpecs || loadingIps) return ac

      const nodeSpecs = specs[node.hash]?.data
      const nodeIps = ips[node.hash]?.data

      if (!loadingSpecs) {
        const validSpecs =
          nodeSpecs && nodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)

        if (!validSpecs) {
          ac[node.hash] = StreamNotSupportedIssue.MinSpecs
          return ac
        }
      }

      if (!loadingIps) {
        const validIp = nodeIps && !!nodeIps.vm

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
  }, [
    baseFilteredNodes,
    nodeManager,
    loadingSpecs,
    loadingIps,
    specs,
    ips,
    minSpecs,
  ])

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

  // -----------------------------

  const { list: sortedFilteredNodes, handleSortItems } = useSortedList({
    list: sortedNodes,
  })

  const {
    list: paginatedSortedFilteredNodes,
    loadItemsDisabled,
    handleLoadItems,
  } = usePaginatedList({
    list: sortedFilteredNodes,
    itemsPerPage: 20,
    resetDeps: [baseFilteredNodes],
  })

  const loading = loadingSpecs || loadingIps

  return {
    nodes,
    lastVersion,
    specs,
    loading,
    nodesIssues,
    filteredNodes: paginatedSortedFilteredNodes,
    filter,
    validPAYGNodesOnly,
    loadItemsDisabled,
    handleLoadItems,
    handleSortItems,
    handleFilterChange,
    handleValidPAYGNodesOnlyChange,
  }
}
