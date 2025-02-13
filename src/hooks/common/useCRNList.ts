import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { UseRequestCRNsReturn } from '@/hooks/common/useRequestEntity/useRequestCRNs'
import {
  UseRequestCRNSpecsReturn,
  useRequestCRNSpecs,
} from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import { CRNSpecs, StreamNotSupportedIssue } from '@/domain/node'
import { useDebounceState, usePaginatedList } from '@aleph-front/core'
import {
  UseSortedListReturn,
  useSortedList,
} from '@/hooks/common/useSortedList'
import { useDefaultTiers } from './pricing/tiers/useDefaultTiers'
import { useRequestCRNLastVersion } from './useRequestEntity/useRequestCRNLastVersion'

export type StreamSupportedIssues = Record<string, StreamNotSupportedIssue>

export type UseCRNListProps = {
  selected?: string
  onSelectedChange: (selected: string) => void
}

export type UseCRNListReturn = UseCRNListProps &
  UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn & {
    nodesIssues?: StreamSupportedIssues
    filteredNodes?: CRNSpecs[]
    filter: string
    validPAYGNodesOnly: boolean
    loadItemsDisabled: boolean
    handleLoadItems: () => Promise<void>
    handleSortItems: UseSortedListReturn<any>['handleSortItems']
    handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
    handleValidPAYGNodesOnlyChange: (e: ChangeEvent<HTMLInputElement>) => void
  }

export function useCRNList(props: UseCRNListProps): UseCRNListReturn {
  const nodeManager = useNodeManager()
  const { specs: crnSpecs, loading: loadingSpecs } = useRequestCRNSpecs()
  const { lastVersion } = useRequestCRNLastVersion()

  // -----------------------------

  const [filter, setFilter] = useState('')

  const debouncedFilter = useDebounceState(filter, 200)

  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const filter = e.target.value
    setFilter(filter)
  }, [])

  // -----------------------------

  const filterNodes = useCallback(
    (query: string, crnSpecs?: CRNSpecs[]): CRNSpecs[] | undefined => {
      if (!crnSpecs) return
      if (!query) return crnSpecs

      return crnSpecs.filter((crnSpec) =>
        crnSpec.name?.toLowerCase().includes(query.toLowerCase()),
      )
    },
    [],
  )

  const baseFilteredNodes = useMemo(
    () => filterNodes(debouncedFilter, Object.values(crnSpecs)),
    [filterNodes, debouncedFilter, crnSpecs],
  )

  // -----------------------------

  const { defaultTiers } = useDefaultTiers({ type: 'instance' })

  const minSpecs = useMemo(() => {
    const [min] = defaultTiers
    return min
  }, [defaultTiers])

  const nodesIssues = useMemo(() => {
    if (!baseFilteredNodes) return

    return baseFilteredNodes.reduce((ac, node) => {
      const issue = nodeManager.isStreamPaymentNotSupported(node)

      if (issue) {
        ac[node.hash] = issue
        return ac
      }

      if (loadingSpecs) return ac

      const nodeSpecs = crnSpecs[node.hash]

      if (!loadingSpecs) {
        const validSpecs =
          nodeSpecs && nodeManager.validateMinNodeSpecs(minSpecs, nodeSpecs)

        if (!validSpecs) {
          ac[node.hash] = StreamNotSupportedIssue.MinSpecs
          return ac
        }
      }

      if (!nodeSpecs.ipv6_check?.vm) {
        ac[node.hash] = StreamNotSupportedIssue.IPV6
        return ac
      }

      if (nodeSpecs && nodeSpecs.ipv6_check) {
        ac[node.hash] = StreamNotSupportedIssue.Valid
      }

      return ac
    }, {} as StreamSupportedIssues)
  }, [baseFilteredNodes, nodeManager, loadingSpecs, crnSpecs, minSpecs])

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

  return {
    ...props,
    lastVersion,
    specs: crnSpecs,
    loading: loadingSpecs,
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
