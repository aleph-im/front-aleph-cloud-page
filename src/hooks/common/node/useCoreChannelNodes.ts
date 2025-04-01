import { useAppState } from '@/contexts/appState'
import { CCN, NodeLastVersions } from '@/domain/node'
import { Account } from '@aleph-sdk/account'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { UseSortedListReturn, useSortedList } from '../useSortedList'
import { useFilter } from '../useFilter'
import { UseFiltersReturn } from '../useFilters'

export type UseCoreChannelNodesProps = {
  nodes?: CCN[]
  filterKey?: string
}

export type UseCoreChannelNodesReturn = {
  account?: Account
  accountBalance?: number
  nodes?: CCN[]
  filteredNodes?: CCN[]
  filter?: string
  lastVersion?: NodeLastVersions
  handleSortItems: UseSortedListReturn<CCN>['handleSortItems']
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
} & Pick<UseFiltersReturn, 'filters'>

export function useCoreChannelNodes({
  nodes: prefetchNodes,
  filterKey = 'ccnq',
}: UseCoreChannelNodesProps): UseCoreChannelNodesReturn {
  const [state] = useAppState()
  const { account, balance: accountBalance = 0 } = state.connection
  const { data: lastVersion } = state.lastCCNVersion
  const { entities: data } = state.ccns
  const filters = state.filter

  const nodes = prefetchNodes || data

  // -----------------------------

  const [ccnqFilter, setCcnqFilter] = useFilter({
    key: filterKey,
    debounced: 200,
  })

  const [filter, setFilter] = useState<string>()

  const handleFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const filter = e.target.value
      setFilter(filter)
      setCcnqFilter(filter)
    },
    [setCcnqFilter],
  )

  useEffect(() => {
    if (filter !== undefined) return
    if (!ccnqFilter) return

    setFilter(ccnqFilter)
  }, [ccnqFilter, filter])

  // -----------------------------

  const filterNodes = useCallback(
    (query?: string, nodes?: CCN[]): CCN[] | undefined => {
      if (!nodes) return
      if (!query) return nodes

      return nodes.filter((node) =>
        node.name?.toLowerCase().includes(query.toLowerCase()),
      )
    },
    [],
  )

  const filteredNodes = useMemo(
    () => filterNodes(ccnqFilter, nodes),
    [filterNodes, ccnqFilter, nodes],
  )

  const presortedFilteredNodes = useMemo(() => {
    if (!filteredNodes) return
    return filteredNodes.sort((a, b) => b.score - a.score)
  }, [filteredNodes])

  // -----------------------------

  const { list: sortedFilteredNodes, handleSortItems } = useSortedList({
    list: presortedFilteredNodes,
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