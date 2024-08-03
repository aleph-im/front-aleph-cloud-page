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

export type UseCRNListProps = {
  selected?: string
  onSelectedChange: (selected: string) => void
}

export type NameFilter = {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export type ValidPAYGNodesOnlyFilter = {
  value: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export type CpuFilter = {
  value: string
  options: string[]
  onChange: (value: string) => void
}

export type RamFilter = {
  value: string
  options: string[]
  onChange: (value: string) => void
}

export type HddFilter = {
  value: string
  options: string[]
  onChange: (value: string) => void
}

export type UseCRNListReturn = UseCRNListProps &
  UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn & {
    nodesIssues?: StreamSupportedIssues
    filteredNodes?: CRN[]
    nameFilter: NameFilter
    validPAYGNodesOnlyFilter: ValidPAYGNodesOnlyFilter
    cpuFilter: CpuFilter
    ramFilter: RamFilter
    hddFilter: HddFilter
    loadItemsDisabled: boolean
    handleLoadItems: () => Promise<void>
    handleSortItems: UseSortedListReturn<any>['handleSortItems']
  }

export function useCRNList(props: UseCRNListProps): UseCRNListReturn {
  const { nodes, lastVersion } = useRequestCRNs({})
  const nodeManager = useNodeManager()

  // -----------------------------
  const [nameFilterValue, setNameFilterValue] =
    useState<NameFilter['value']>('')

  const [validPAYGNodesOnlyFilterValue, setValidPAYGNodesOnlyFilterValue] =
    useState<ValidPAYGNodesOnlyFilter['value']>(true)

  const [cpuFilterValue, setCpuFilterValue] = useState<CpuFilter['value']>('')
  const [ramFilterValue, setRamFilterValue] = useState<RamFilter['value']>('')
  const [hddFilterValue, setHddFilterValue] = useState<HddFilter['value']>('')

  const debouncedNameFilter = useDebounceState(nameFilterValue, 200)

  // -----------------------------

  const filterNodes = useCallback(
    (nameFilter: string, nodes?: CRN[]): CRN[] | undefined => {
      if (!nodes) return
      if (!nameFilter) return nodes

      let filteredNodes: CRN[] = [...nodes]
      if (nameFilter) {
        filteredNodes = filteredNodes.filter((node) =>
          node.name?.toLowerCase().includes(nameFilter.toLowerCase()),
        )
      }

      return filteredNodes
    },
    [],
  )

  const baseFilteredNodes = useMemo(
    () => filterNodes(debouncedNameFilter, nodes),
    [filterNodes, debouncedNameFilter, nodes],
  )

  // -----------------------------

  const { specs, loading: loadingSpecs } = useRequestCRNSpecs({
    nodes: baseFilteredNodes,
  })

  const { ips, loading: loadingIps } = useRequestCRNIps({
    nodes: baseFilteredNodes,
  })

  const cpuFilterOptions: CpuFilter['options'] = useMemo(() => {
    if (!baseFilteredNodes) return []

    const options = baseFilteredNodes.reduce((ac, node) => {
      const cpuCount = specs[node.hash]?.data?.cpu.count
      if (cpuCount && !ac.includes(cpuCount.toString())) {
        ac.push(cpuCount.toString())
      }
      return ac
    }, [] as string[])

    return options.sort((a, b) => Number(a) - Number(b))
  }, [baseFilteredNodes, specs])

  const ramFilterOptions: RamFilter['options'] = useMemo(() => {
    if (!baseFilteredNodes) return []

    const options = baseFilteredNodes.reduce((ac, node) => {
      const ram = specs[node.hash]?.data?.mem.available_kB
      if (ram && !ac.includes(ram.toString())) {
        ac.push(ram.toString())
      }
      return ac
    }, [] as string[])

    return options.sort((a, b) => Number(a) - Number(b))
  }, [baseFilteredNodes, specs])

  const hddFilterOptions: HddFilter['options'] = useMemo(() => {
    if (!baseFilteredNodes) return []

    const options = baseFilteredNodes.reduce((ac, node) => {
      const hdd = specs[node.hash]?.data?.disk.available_kB
      if (hdd && !ac.includes(hdd.toString())) {
        ac.push(hdd.toString())
      }
      return ac
    }, [] as string[])

    return options.sort((a, b) => Number(a) - Number(b))
  }, [baseFilteredNodes, specs])

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

  const handleNameFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const nameFilterValue = e.target.value
      setNameFilterValue(nameFilterValue)
    },
    [],
  )

  const handleValidPAYGNodesOnlyFilterChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setValidPAYGNodesOnlyFilterValue(e.target.checked)
    },
    [],
  )

  const handleCpuFilterChange = useCallback(async (value: string) => {
    setCpuFilterValue(value)
  }, [])

  const handleRamFilterChange = useCallback(async (value: string) => {
    setRamFilterValue(value)
  }, [])

  const handleHddFilterChange = useCallback(async (value: string) => {
    setHddFilterValue(value)
  }, [])

  const filteredNodes = useMemo(() => {
    if (!baseFilteredNodes) return

    let filteredNodes = [...baseFilteredNodes]

    if (validPAYGNodesOnlyFilterValue && nodesIssues) {
      filteredNodes = filteredNodes.filter((node) => !nodesIssues[node.hash])
    }

    if (cpuFilterValue && specs) {
      filteredNodes = filteredNodes.filter((node) => {
        return specs[node.hash]?.data?.cpu.count === Number(cpuFilterValue)
      })
    }

    if (ramFilterValue && specs) {
      filteredNodes = filteredNodes.filter((node) => {
        return (
          specs[node.hash]?.data?.mem.available_kB === Number(ramFilterValue)
        )
      })
    }

    if (hddFilterValue && specs) {
      filteredNodes = filteredNodes.filter((node) => {
        return (
          specs[node.hash]?.data?.disk.available_kB === Number(hddFilterValue)
        )
      })
    }

    return filteredNodes
  }, [
    baseFilteredNodes,
    cpuFilterValue,
    hddFilterValue,
    nodesIssues,
    ramFilterValue,
    specs,
    validPAYGNodesOnlyFilterValue,
  ])

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
    ...props,
    nodes,
    lastVersion,
    specs,
    loading,
    nodesIssues,
    filteredNodes: paginatedSortedFilteredNodes,
    loadItemsDisabled,
    nameFilter: {
      value: nameFilterValue,
      onChange: handleNameFilterChange,
    },
    validPAYGNodesOnlyFilter: {
      value: validPAYGNodesOnlyFilterValue,
      onChange: handleValidPAYGNodesOnlyFilterChange,
    },
    cpuFilter: {
      value: cpuFilterValue,
      options: cpuFilterOptions,
      onChange: handleCpuFilterChange,
    },
    ramFilter: {
      value: ramFilterValue,
      options: ramFilterOptions,
      onChange: handleRamFilterChange,
    },
    hddFilter: {
      value: hddFilterValue,
      options: hddFilterOptions,
      onChange: handleHddFilterChange,
    },
    handleLoadItems,
    handleSortItems,
  }
}
