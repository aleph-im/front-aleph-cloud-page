import { useAppState } from '@/contexts/appState'
import { CRN, NodeLastVersions } from '@/domain/node'
import { Account } from '@aleph-sdk/account'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { UseSortedListReturn, useSortedList } from '../useSortedList'
import { useFilter } from '../useFilter'

export type UseFilterReturn = {
  [key: string]: string
}

export type UseFiltersReturn = {
  filters: UseFilterReturn
}

export type UseComputeResourceNodesProps = {
  nodes?: CRN[]
}

export type UseComputeResourceNodesReturn = {
  account?: Account
  accountBalance?: number
  nodes?: CRN[]
  filteredNodes?: CRN[]
  filter?: string
  lastVersion?: NodeLastVersions
  handleSortItems: UseSortedListReturn<CRN>['handleSortItems']
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
} & Pick<UseFiltersReturn, 'filters'>

export function useComputeResourceNodes({
  nodes: prefetchNodes,
}: UseComputeResourceNodesProps): UseComputeResourceNodesReturn {
  const [state] = useAppState()
  const { account, balance: accountBalance = 0 } = state.connection
  const { data: lastVersion } = state.lastCRNVersion
  const { entities: data } = state.crns
  const filters = state.filter || {}

  // -----------------------------

  const [crnqFilter, setCrnqFilter] = useFilter({
    key: 'crnq',
    debounced: 200,
  })

  const [filter, setFilter] = useState<string>()

  const handleFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const filter = e.target.value
      setFilter(filter)
      setCrnqFilter(filter)
    },
    [setCrnqFilter],
  )

  useEffect(() => {
    if (filter !== undefined) return
    if (!crnqFilter) return

    setFilter(crnqFilter)
  }, [crnqFilter, filter])

  // -----------------------------

  const filterNodes = useCallback(
    (query?: string, nodes?: CRN[]): CRN[] | undefined => {
      if (!nodes) return
      if (!query) return nodes

      return nodes.filter(
        (node) =>
          node.name?.toLowerCase().includes(query.toLowerCase()) ||
          (node.parentData?.name || '')
            .toLowerCase()
            .includes(query.toLowerCase()),
      )
    },
    [],
  )

  const nodes = useMemo(() => {
    const nodes = prefetchNodes || data
    if (!nodes) return

    return nodes.sort((a, b) => b.score - a.score)
  }, [prefetchNodes, data])

  const filteredNodes = useMemo(
    () => filterNodes(crnqFilter, nodes),
    [filterNodes, crnqFilter, nodes],
  )

  // -----------------------------

  const { list: sortedFilteredNodes, handleSortItems } = useSortedList({
    list: filteredNodes,
  })

  // -----------------------------

  return {
    account,
    accountBalance,
    nodes,
    filteredNodes: sortedFilteredNodes,
    filter,
    lastVersion,
    filters,
    handleSortItems,
    handleFilterChange,
  }
}