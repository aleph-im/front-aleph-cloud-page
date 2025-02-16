import { KeyboardEvent, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import {
  Button,
  Dropdown,
  DropdownOption,
  Icon,
  NodeName,
  NodeScore,
  NodeVersion,
  NoisyContainer,
  TableColumn,
  TextInput,
} from '@aleph-front/core'
import { apiServer } from '@/helpers/constants'
import { useCRNList } from '@/hooks/common/useCRNList'
import NodesTable from '@/components/common/NodesTable'
import { humanReadableSize } from '@/helpers/utils'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import Price from '@/components/common/Price'
import { CRNItem, CRNListProps } from './types'

export default function CRNList(props: CRNListProps) {
  const {
    enableGpu = false,
    selected,
    lastVersion,
    specs,
    nodesIssues,
    filteredNodes,
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
    onSelectedChange,
  } = useCRNList(props)

  const theme = useTheme()

  const columns = useMemo(() => {
    const gpuColumn = enableGpu
      ? ({
          label: 'GPU',
          width: '10%',
          sortable: true,
          sortBy: (node) => node.selectedGpu?.model,
          render: (node) => (
            <div tw="whitespace-nowrap">{node.selectedGpu?.model}</div>
          ),
        } as TableColumn<CRNItem>)
      : undefined

    return (
      [
        {
          label: 'SCORE',
          width: '10%',
          sortable: true,
          sortBy: (node) => node.score,
          render: (node) => <NodeScore score={node.score} />,
        },
        {
          label: 'NAME',
          width: '20%',
          sortable: true,
          sortBy: (node) => node.name,
          render: (node) => (
            <NodeName
              hash={node.hash}
              name={node.name}
              picture={node.picture}
              ImageCmp={Image}
              apiServer={apiServer}
            />
          ),
        },
        gpuColumn,
        {
          label: 'CPU',
          width: '10%',
          sortable: true,
          sortBy: (node) => specs[node.hash]?.cpu?.count || 0,
          render: (node) => (
            <div tw="whitespace-nowrap">
              {specs[node.hash]
                ? `${specs[node.hash]?.cpu?.count} x86 64bit`
                : 'n/a'}
            </div>
          ),
        },
        {
          label: 'RAM',
          width: '10%',
          sortable: true,
          sortBy: (node) => specs[node.hash]?.mem?.available_kB || 0,
          render: (node) => (
            <div tw="whitespace-nowrap">
              {humanReadableSize(specs[node.hash]?.mem?.available_kB, 'KiB')}
            </div>
          ),
        },
        {
          label: 'HDD',
          width: '10%',
          sortable: true,
          sortBy: (node) => specs[node.hash]?.disk?.available_kB || 0,
          render: (node) => (
            <div tw="whitespace-nowrap">
              {humanReadableSize(specs[node.hash]?.disk?.available_kB, 'KiB')}
            </div>
          ),
        },
        {
          label: 'VERSION',
          width: '20%',
          sortable: true,
          sortBy: (node) => node?.version,
          render: (node) => (
            <NodeVersion
              version={node?.version || ''}
              lastVersion={lastVersion}
            />
          ),
        },
        {
          label: 'PRICE',
          width: '20%',
          sortable: true,
          sortBy: () => 0.11,
          render: () => (
            <div tw="flex items-center gap-1 whitespace-nowrap">
              <Price value={0.11} /> per unit / h
            </div>
          ),
        },
        {
          label: '',
          align: 'right',
          width: '100%',
          cellProps: () => ({ css: { opacity: '1 !important' } }),
          render: (node) => {
            return (
              <div tw="flex gap-3 justify-end">
                <Button
                  color="main0"
                  variant="tertiary"
                  kind="default"
                  size="md"
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  tabIndex={-1}
                  className="check-button"
                  style={{
                    visibility: node.isActive ? 'visible' : 'hidden',
                    opacity: node.isActive ? '1' : '0',
                    transition: 'all ease-in-out 500ms 0ms',
                    transitionProperty: 'opacity visibility',
                  }}
                >
                  <Icon name="check" size="lg" />
                </Button>
              </div>
            )
          },
        },
      ] as TableColumn<CRNItem>[]
    ).filter((c) => c !== undefined)
  }, [enableGpu, specs, lastVersion])

  const data: CRNItem[] = useMemo(() => {
    if (!filteredNodes) return []

    return filteredNodes.map((node) => {
      const { hash, selectedGpu } = node

      const isActive =
        `${hash}-${selectedGpu?.device_id}` ===
        `${selected?.hash}-${selected?.selectedGpu?.device_id}`
      const issue = nodesIssues?.[hash]
      const isLoading = issue === undefined
      const disabled = !isLoading && !!issue

      return {
        ...node,
        isActive,
        isLoading,
        disabled,
        issue,
      }
    })
  }, [filteredNodes, nodesIssues, selected])

  const handleRowProps = useCallback(
    (row: CRNItem) => ({
      tabIndex: row.disabled ? -1 : 0,
      className: `${row.disabled ? '_disabled' : ''} ${
        row.isActive ? '_active' : ''
      } ${row.isLoading ? '_loading' : ''}`,
      onClick: () => {
        if (row.disabled) return
        if (row.isLoading) return

        onSelectedChange(row)
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code !== 'Space' && e.code !== 'Enter') return
        if (row.disabled) return
        if (row.isLoading) return

        e.preventDefault()

        onSelectedChange(row)
      },
    }),
    [onSelectedChange],
  )

  const loadingPlaceholder = useMemo(
    () => (
      <div tw="flex justify-center">
        <RotatingLines strokeColor={theme.color.main0} width="4rem" />
      </div>
    ),
    [theme],
  )

  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <SpinnerOverlay show={!filteredNodes} />

      <NoisyContainer tw="h-full w-full">
        <div tw="flex mb-8 gap-10 justify-between flex-wrap flex-col md:flex-row items-stretch md:items-center">
          <div tw="flex-1">
            <TextInput
              value={nameFilter}
              label="Search CRN"
              name="filter-crn"
              placeholder="Search CRN"
              onChange={handleNameFilterChange}
              icon={<Icon name="search" />}
            />
          </div>
        </div>
        <div tw="w-full flex flex-wrap gap-x-6 gap-y-4 mb-6">
          <div tw="flex-1">
            <Dropdown
              placeholder="CPU"
              label="CPU"
              value={cpuFilter}
              onChange={handleCpuFilterChange}
            >
              {filterOptions.cpu.map((option) => (
                <DropdownOption key={option} value={option}>
                  {option}
                </DropdownOption>
              ))}
            </Dropdown>
          </div>
          <div tw="flex-1">
            <Dropdown
              placeholder="RAM"
              label="RAM"
              value={ramFilter}
              onChange={handleRamFilterChange}
            >
              {filterOptions.ram.map((option) => (
                <DropdownOption key={option} value={option}>
                  {humanReadableSize(+option, 'KiB')}
                </DropdownOption>
              ))}
            </Dropdown>
          </div>
          <div tw="flex-1">
            <Dropdown
              placeholder="HDD"
              label="HDD"
              value={hddFilter}
              onChange={handleHddFilterChange}
            >
              {filterOptions.hdd.map((option) => (
                <DropdownOption key={option} value={option}>
                  {humanReadableSize(+option, 'KiB')}
                </DropdownOption>
              ))}
            </Dropdown>
          </div>
        </div>
        <div
          tw="min-h-[20rem] h-full overflow-auto"
          ref={infiniteScrollContainerRef}
        >
          <NodesTable
            {...{
              columns,
              data,
              infiniteScroll: !loadItemsDisabled,
              infiniteScrollContainerRef,
              onLoadMore: handleLoadItems,
              onSort: handleSortItems,
              rowProps: handleRowProps,
              loadingPlaceholder,
            }}
          />
        </div>
      </NoisyContainer>
    </>
  )
}
