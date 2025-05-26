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
  showInactive: boolean
  handleSortItems: UseSortedListReturn<CRN>['handleSortItems']
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleShowInactiveChange: (e: ChangeEvent<HTMLInputElement>) => void
} & Pick<UseFiltersReturn, 'filters'>

export function useComputeResourceNodes({
  nodes: prefetchNodes,
}: UseComputeResourceNodesProps): UseComputeResourceNodesReturn {
  const [state] = useAppState()
  const { account, balance: accountBalance = 0 } = state.connection
  const { data: lastVersion } = state.lastCRNVersion
  const { entities: data } = state.crns
  // Convert FilterState to UseFilterReturn
  const filters = useMemo(() => {
    const result: UseFilterReturn = {}
    Object.entries(state.filter || {}).forEach(([key, value]) => {
      if (value) {
        result[key] = value.value
      }
    })
    return result
  }, [state.filter])

  // -----------------------------

  const [crnqFilter, setCrnqFilter] = useFilter({
    key: 'crnq',
    debounced: 200,
  })

  const [filter, setFilter] = useState<string>()
  const [showInactive, setShowInactive] = useState<boolean>(false)

  const handleFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const filter = e.target.value
      setFilter(filter)
      setCrnqFilter(filter)
    },
    [setCrnqFilter],
  )

  const handleShowInactiveChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShowInactive(e.target.checked)
    },
    [],
  )

  useEffect(() => {
    if (filter !== undefined) return
    if (!crnqFilter) return

    setFilter(crnqFilter)
  }, [crnqFilter, filter])

  // -----------------------------

  const filterNodesByQuery = useCallback((query?: string) => {
    if (!query) return () => true

    return (node: CRN) =>
      node.name?.toLowerCase().includes(query.toLowerCase()) ||
      (node.parentData?.name || '').toLowerCase().includes(query.toLowerCase())
  }, [])

  const filterInactiveNodes = useCallback(
    () => (node: CRN) => {
      if (showInactive) return true

      return !node.inactive_since && node.score > 0
    },
    [showInactive],
  )

  const nodes = useMemo(() => {
    const nodes = prefetchNodes || data
    if (!nodes) return

    return nodes.sort((a, b) => b.score - a.score)
  }, [prefetchNodes, data])

  const filteredNodes = useMemo(() => {
    if (!nodes) return
    return nodes
      .filter(filterNodesByQuery(crnqFilter))
      .filter(filterInactiveNodes())
  }, [filterNodesByQuery, filterInactiveNodes, crnqFilter, nodes])

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
    showInactive,
    handleSortItems,
    handleFilterChange,
    handleShowInactiveChange,
  }
}
