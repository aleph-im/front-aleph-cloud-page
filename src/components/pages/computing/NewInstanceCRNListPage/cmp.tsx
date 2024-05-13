import { KeyboardEvent, useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  Button,
  Checkbox,
  Icon,
  NodeName,
  NodeScore,
  NodeVersion,
  NoisyContainer,
  TableColumn,
  TextInput,
  Tooltip,
} from '@aleph-front/core'
import { PaymentMethod, apiServer } from '@/helpers/constants'
import Container from '@/components/common/CenteredContainer'
import { useNewInstanceCRNListPage } from '@/hooks/pages/computing/useNewInstanceCRNListPage'
import NewEntityTab from '../NewEntityTab'
import NodesTable from '@/components/common/NodesTable'
import { humanReadableSize } from '@/helpers/utils'
import ButtonLink from '@/components/common/ButtonLink'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import Price from '@/components/common/Price'
import { PageProps } from '@/types/types'
import { CRNItem } from './types'
import CheckoutSummaryFooter from '@/components/form/CheckoutSummaryFooter'
import { StreamNotSupportedIssue } from '@/domain/node'

export default function NewInstanceCRNListPage({ mainRef }: PageProps) {
  const {
    lastVersion,
    specs,
    nodesIssues,
    filter,
    filteredNodes,
    validPAYGNodesOnly,
    loadItemsDisabled,
    handleLoadItems,
    handleSortItems,
    handleFilterChange,
    handleValidPAYGNodesOnlyChange,
  } = useNewInstanceCRNListPage()

  const theme = useTheme()

  const columns = useMemo(() => {
    return [
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
      {
        label: 'CPU',
        width: '10%',
        sortable: true,
        sortBy: (node) => specs[node.hash]?.data?.cpu.count || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {specs[node.hash]?.data
              ? `${specs[node.hash]?.data?.cpu.count} x86 64bit`
              : 'n/a'}
          </div>
        ),
      },
      {
        label: 'RAM',
        width: '10%',
        sortable: true,
        sortBy: (node) => specs[node.hash]?.data?.mem.available_kB || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {humanReadableSize(specs[node.hash]?.data?.mem.available_kB, 'KiB')}
          </div>
        ),
      },
      {
        label: 'HDD',
        width: '10%',
        sortable: true,
        sortBy: (node) => specs[node.hash]?.data?.disk.available_kB || 0,
        render: (node) => (
          <div tw="whitespace-nowrap">
            {humanReadableSize(
              specs[node.hash]?.data?.disk.available_kB,
              'KiB',
            )}
          </div>
        ),
      },
      {
        label: 'VERSION',
        width: '20%',
        sortable: true,
        sortBy: (node) => node.metricsData?.version,
        render: (node) => (
          <NodeVersion
            version={node.metricsData?.version || ''}
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
              {node.issue ? (
                <Tooltip
                  my="bottom-right"
                  at="top-left"
                  content={
                    <div className="tp-body1 fs-12">
                      <div className="tp-body3 fs-16">
                        Why are some nodes unavailable?
                      </div>
                      <div>
                        A node may be grayed out and not selectable for the
                        following reasons:
                      </div>
                      <ul tw="my-4 pl-6 list-disc">
                        {node.issue === StreamNotSupportedIssue.IPV6 && (
                          <li>
                            <strong>IPv6 Egress Issue:</strong> The node&apos;s
                            compute resource (CRN) is unable to establish an
                            IPv6 egress connection.
                          </li>
                        )}
                        {node.issue === StreamNotSupportedIssue.MinSpecs && (
                          <li>
                            <strong>Minimum Specifications:</strong> The node
                            does not meet the required minimum hardware or
                            software specifications.
                          </li>
                        )}
                        {node.issue === StreamNotSupportedIssue.Version && (
                          <li>
                            <strong>Version Compatibility:</strong> Only nodes
                            with version 0.4.0 or higher are eligible for
                            selection.
                          </li>
                        )}
                        {node.issue ===
                          StreamNotSupportedIssue.RewardAddress && (
                          <li>
                            <strong>Stream Reward Configuration:</strong> The
                            node lacks a configured stream reward address, which
                            is necessary for operation.
                          </li>
                        )}
                      </ul>
                      <div>
                        Please select from the available nodes that meet all the
                        necessary criteria for a smooth and efficient setup.
                      </div>
                    </div>
                  }
                >
                  <Icon
                    name="exclamation-circle"
                    color={theme.color.text}
                    tw="px-5 cursor-help"
                  />
                </Tooltip>
              ) : node.isLoading ? (
                <Button
                  size="md"
                  color="main2"
                  tw="w-16!"
                  className="check-button"
                  disabled
                >
                  <RotatingLines strokeColor={theme.color.main0} width="1em" />
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>
          )
        },
      },
    ] as TableColumn<CRNItem>[]
  }, [specs, lastVersion, theme])

  const [selected, setSelected] = useState<string>()

  const data: CRNItem[] = useMemo(() => {
    if (!filteredNodes) return []

    return filteredNodes.map((node) => {
      const { hash } = node

      const isActive = hash === selected
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

        setSelected(row.hash)
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.code !== 'Space' && e.code !== 'Enter') return
        if (row.disabled) return
        if (row.isLoading) return

        e.preventDefault()
        setSelected(row.hash)
      },
    }),
    [],
  )

  const loadingPlaceholder = useMemo(
    () => (
      <div tw="flex justify-center">
        <RotatingLines strokeColor={theme.color.main0} width="4rem" />
      </div>
    ),
    [theme],
  )

  return (
    <>
      <section tw="px-0 py-0 md:py-8">
        <Container as={'div'}>
          <NewEntityTab selected="instance" />
        </Container>
      </section>
      <section tw="relative px-0 pt-20 pb-6 md:py-10">
        <SpinnerOverlay show={!filteredNodes} />
        <Container $variant="xl" as={'div'}>
          <NoisyContainer>
            <div tw="flex mb-8 gap-10 justify-between flex-wrap flex-col md:flex-row items-stretch md:items-center">
              <div tw="flex-1">
                <TextInput
                  value={filter}
                  name="filter-crn"
                  placeholder="Search CRN"
                  onChange={handleFilterChange}
                  icon={<Icon name="search" />}
                />
              </div>
              <div>
                <Checkbox
                  label="Ready for PAYG"
                  checked={validPAYGNodesOnly}
                  onChange={handleValidPAYGNodesOnlyChange}
                  size="xs"
                />
              </div>
            </div>
            <NodesTable
              {...{
                columns,
                data,
                infiniteScroll: !loadItemsDisabled,
                onLoadMore: handleLoadItems,
                onSort: handleSortItems,
                rowProps: handleRowProps,
                loadingPlaceholder,
              }}
            />
          </NoisyContainer>
        </Container>
      </section>
      <CheckoutSummaryFooter
        {...{
          paymentMethod: PaymentMethod.Stream,
          submitButton: (
            <ButtonLink
              type="button"
              color="main0"
              kind="default"
              size="md"
              variant="primary"
              href={`./crn/${selected}`}
              disabled={!selected}
            >
              Continue
            </ButtonLink>
          ),
          mainRef,
          totalCost: 0.11,
          shouldHide: false,
          thresholdOffset: 0,
          deps: [data],
        }}
      />
    </>
  )
}
