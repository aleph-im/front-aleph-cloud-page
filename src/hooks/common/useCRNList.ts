import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { UseRequestCRNsReturn } from '@/hooks/common/useRequestEntity/useRequestCRNs'
import {
  UseRequestCRNSpecsReturn,
  useRequestCRNSpecs,
} from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import { CRNSpecs, StreamNotSupportedIssue } from '@/domain/node'
import {
  DropdownProps,
  useDebounceState,
  usePaginatedList,
} from '@aleph-front/core'
import {
  UseSortedListReturn,
  useSortedList,
} from '@/hooks/common/useSortedList'
import { useDefaultTiers } from './pricing/tiers/useDefaultTiers'
import { useRequestCRNLastVersion } from './useRequestEntity/useRequestCRNLastVersion'

export type StreamSupportedIssues = Record<string, StreamNotSupportedIssue>

export type UseCRNListProps = {
  selected?: CRNSpecs
  onSelectedChange: (selected: CRNSpecs) => void
  enableGpu?: boolean
}

export type UseCRNListReturn = UseCRNListProps &
  UseRequestCRNsReturn &
  UseRequestCRNSpecsReturn & {
    nodesIssues?: StreamSupportedIssues
    filteredNodes?: CRNSpecs[]
    filterOptions: { cpu: string[]; ram: string[]; hdd: string[] }
    loadItemsDisabled: boolean
    handleLoadItems: () => Promise<void>
    handleSortItems: UseSortedListReturn<any>['handleSortItems']
    nameFilter: string
    handleNameFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
    cpuFilter?: string
    handleCpuFilterChange: DropdownProps['onChange']
    ramFilter?: string
    handleRamFilterChange: DropdownProps['onChange']
    hddFilter?: string
    handleHddFilterChange: DropdownProps['onChange']
  }

export function useCRNList(props: UseCRNListProps): UseCRNListReturn {
  const { enableGpu } = props

  const nodeManager = useNodeManager()
  const { specs: crnSpecs, loading: loadingSpecs } = useRequestCRNSpecs()
  const { lastVersion } = useRequestCRNLastVersion()

  // -----------------------------
  // Name Filter

  const [nameFilter, setNameFilter] = useState('')

  const debouncedFilter = useDebounceState(nameFilter, 200)

  const handleNameFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const nameFilter = e.target.value
      setNameFilter(nameFilter)
    },
    [],
  )

  // -----------------------------
  // CPU Filter

  const [cpuFilter, setCpuFilter] = useState<string>()

  const handleCpuFilterChange = useCallback((value: string | string[]) => {
    if (!value) return setCpuFilter(undefined)
    if (typeof value !== 'string') return

    const cpuFilter = value
    setCpuFilter(cpuFilter)
  }, [])

  // -----------------------------
  // RAM Filter

  const [ramFilter, setRamFilter] = useState<string>()

  const handleRamFilterChange = useCallback((value: string | string[]) => {
    if (!value) return setRamFilter(undefined)
    if (typeof value !== 'string') return

    const ramFilter = value
    setRamFilter(ramFilter)
  }, [])

  // -----------------------------
  // HDD Filter

  const [hddFilter, setHddFilter] = useState<string>()

  const handleHddFilterChange = useCallback((value: string | string[]) => {
    if (!value) return setHddFilter(undefined)
    if (typeof value !== 'string') return

    const hddFilter = value
    setHddFilter(hddFilter)
  }, [])

  // -----------------------------

  const nodeList = useMemo(() => {
    if (!enableGpu) return crnSpecs

    let gpuNodes: Record<string, CRNSpecs> = {}

    Object.values(crnSpecs)
      .filter((node) => node.gpu_support)
      .forEach((node) => {
        node.compatible_available_gpus?.forEach((gpu) => {
          gpuNodes = { ...gpuNodes, [node.hash]: { ...node, selectedGpu: gpu } }
        })
      })

    console.log('formatted gpuNodes', gpuNodes)

    return gpuNodes
  }, [enableGpu, crnSpecs])

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
    () => filterNodes(debouncedFilter, Object.values(nodeList)),
    [filterNodes, debouncedFilter, nodeList],
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

  const validPAYGNodes = useMemo(() => {
    if (!baseFilteredNodes) return
    if (!nodesIssues) return baseFilteredNodes

    return baseFilteredNodes
  }, [baseFilteredNodes, nodesIssues])

  const filteredNodes = useMemo(() => {
    return validPAYGNodes?.filter((node) => {
      if (cpuFilter) {
        if (node.cpu?.count.toString() !== cpuFilter) return false
      }

      if (ramFilter) {
        if (node.mem?.available_kB.toString() !== ramFilter) return false
      }

      if (hddFilter) {
        if (node.disk?.available_kB.toString() !== hddFilter) return false
      }

      return true
    })
  }, [cpuFilter, hddFilter, ramFilter, validPAYGNodes])

  const sortedNodes = useMemo(() => {
    if (!filteredNodes) return

    return filteredNodes.sort((a, b) => {
      if (a.score > b.score) return -1
      if (a.score < b.score) return 1
      return 0
    })
  }, [filteredNodes])

  // -----------------------------

  const { list: sortedFilteredNodes, handleSortItems } = useSortedList({
    list: sortedNodes,
  })

  const filterOptions = useMemo(() => {
    const options: { cpu: string[]; ram: string[]; hdd: string[] } = {
      cpu: [],
      ram: [],
      hdd: [],
    }

    if (!sortedFilteredNodes) return options

    sortedFilteredNodes.forEach((node) => {
      const cpu = node.cpu?.count.toString()
      const ram = node.mem?.available_kB.toString()
      const hdd = node.disk?.available_kB.toString()

      if (cpu && !options.cpu.includes(cpu)) options.cpu.push(cpu)
      if (ram && !options.ram.includes(ram)) options.ram.push(ram)
      if (hdd && !options.hdd.includes(hdd)) options.hdd.push(hdd)
    })

    return {
      cpu: options.cpu.sort((a, b) => +a - +b),
      ram: options.ram.sort((a, b) => +a - +b),
      hdd: options.hdd.sort((a, b) => +a - +b),
    }
  }, [sortedFilteredNodes])

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
    filterOptions,
    loadItemsDisabled,
    handleLoadItems,
    handleSortItems,
    nameFilter,
    handleNameFilterChange,
    cpuFilter,
    handleCpuFilterChange,
    ramFilter,
    handleRamFilterChange,
    hddFilter,
    handleHddFilterChange,
  }
}
