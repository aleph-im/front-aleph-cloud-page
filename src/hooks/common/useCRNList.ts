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
import { EntityType } from '@/helpers/constants'

export type StreamSupportedIssues = Record<string, StreamNotSupportedIssue>

export type CRNListFilterOptions = {
  gpu: string[]
  cpu: string[]
  ram: string[]
  hdd: string[]
}

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
    filterOptions: CRNListFilterOptions
    loadItemsDisabled: boolean
    handleLoadItems: () => Promise<void>
    handleSortItems: UseSortedListReturn<any>['handleSortItems']
    nameFilter: string
    handleNameFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
    gpuFilter?: string
    handleGpuFilterChange: DropdownProps['onChange']
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
  const { specs: crnSpecs, loading: isLoadingSpecs } = useRequestCRNSpecs()
  const { lastVersion, loading: isLoadingLastVersion } =
    useRequestCRNLastVersion()
  const [isLoadingList, setIsLoadingList] = useState(true)

  // -----------------------------
  // Loading CRN List

  const loading = useMemo(
    () => isLoadingSpecs || isLoadingLastVersion || isLoadingList,
    [isLoadingLastVersion, isLoadingList, isLoadingSpecs],
  )

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
  // GPU Filter

  const [gpuFilter, setGpuFilter] = useState<string>()

  const handleGpuFilterChange = useCallback((value: string | string[]) => {
    if (!value) return setGpuFilter(undefined)
    if (typeof value !== 'string') return

    const gpuFilter = value
    setGpuFilter(gpuFilter)
  }, [])

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
    const crnSpecsList = Object.values(crnSpecs)

    if (!enableGpu) return crnSpecsList

    const gpuList = crnSpecsList
      .filter((node) => node.gpu_support)
      .flatMap((node) =>
        node.compatible_available_gpus?.flatMap((gpu) => ({
          ...node,
          selectedGpu: gpu,
        })),
      ) as CRNSpecs[]

    return gpuList
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
    () => filterNodes(debouncedFilter, nodeList),
    [filterNodes, debouncedFilter, nodeList],
  )

  // -----------------------------

  const { defaultTiers } = useDefaultTiers({ type: EntityType.Instance })

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

      if (isLoadingSpecs) return ac

      const nodeSpecs = crnSpecs[node.hash]

      if (!isLoadingSpecs) {
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
  }, [baseFilteredNodes, nodeManager, isLoadingSpecs, crnSpecs, minSpecs])

  // -----------------------------

  const validPAYGNodes = useMemo(() => {
    if (!baseFilteredNodes) return
    if (!nodesIssues) return baseFilteredNodes

    return baseFilteredNodes.filter((node) => !nodesIssues[node.hash])
  }, [baseFilteredNodes, nodesIssues])

  const filteredNodes = useMemo(() => {
    try {
      return validPAYGNodes?.filter((node) => {
        if (gpuFilter) {
          if (node.selectedGpu?.model !== gpuFilter) return false
        }

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
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingList(false)
    }
  }, [gpuFilter, cpuFilter, hddFilter, ramFilter, validPAYGNodes])

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

  const filterOptions: CRNListFilterOptions = useMemo(() => {
    const options: CRNListFilterOptions = {
      gpu: [],
      cpu: [],
      ram: [],
      hdd: [],
    }

    if (!sortedFilteredNodes) return options

    sortedFilteredNodes.forEach((node) => {
      const gpu = node.selectedGpu?.model
      const cpu = node.cpu?.count.toString()
      const ram = node.mem?.available_kB.toString()
      const hdd = node.disk?.available_kB.toString()

      if (gpu && !options.gpu.includes(gpu)) options.gpu.push(gpu)
      if (cpu && !options.cpu.includes(cpu)) options.cpu.push(cpu)
      if (ram && !options.ram.includes(ram)) options.ram.push(ram)
      if (hdd && !options.hdd.includes(hdd)) options.hdd.push(hdd)
    })

    return {
      gpu: options.gpu.sort(),
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
    loading,
    nodesIssues,
    filteredNodes: paginatedSortedFilteredNodes,
    filterOptions,
    loadItemsDisabled,
    handleLoadItems,
    handleSortItems,
    nameFilter,
    handleNameFilterChange,
    gpuFilter,
    handleGpuFilterChange,
    cpuFilter,
    handleCpuFilterChange,
    ramFilter,
    handleRamFilterChange,
    hddFilter,
    handleHddFilterChange,
  }
}
