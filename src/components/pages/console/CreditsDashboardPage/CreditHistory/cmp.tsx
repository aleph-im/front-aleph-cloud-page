import React, { memo, useCallback, useMemo, useState } from 'react'
import 'twin.macro'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  Spinner,
  Tabs,
  TabsProps,
  TextInput,
} from '@aleph-front/core'
import { StyledTable } from '@/components/common/EntityTable/styles'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { useCreditHistory } from '@/hooks/common/useCreditHistory'
import { formatCredits, getDate } from '@/helpers/utils'
import { StyledSectionHeader, StyledScrollableTableContainer } from '../styles'
import { CreditHistoryProps } from './types'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_expense: 'Expense',
  token_transfer: 'Purchase',
  credit_transfer: 'Transfer',
}

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  credit_expense: 'error',
  token_transfer: 'success',
  credit_transfer: 'info',
}

type TabId = 'all' | 'credit_expense' | 'token_transfer' | 'credit_transfer'

const EmptyTablePlaceholder = ({
  message,
  hasFilters,
}: {
  message: string
  hasFilters?: boolean
}) => (
  <NoisyContainer tw="text-center py-8">
    <Icon name="info-circle" color="base2" size="lg" tw="mb-3" />
    <p className="text-base2 tp-body1">{message}</p>
    {hasFilters && (
      <p className="text-base2 tp-body3" tw="mt-2">
        Try removing some filters to see more data.
      </p>
    )}
  </NoisyContainer>
)

const CreditHistory = ({
  isConnected,
  handleOpenTransferModal,
}: CreditHistoryProps) => {
  const [open, setOpen] = useState(true)
  const [selectedTab, setSelectedTab] = useState<TabId>('all')

  const [showExpenses, setShowExpenses] = useState(false)
  const [showPurchases, setShowPurchases] = useState(true)
  const [showTransfers, setShowTransfers] = useState(true)

  const {
    filteredEntries,
    loading,
    page,
    setPage,
    totalPages,
    filters,
    setFilters,
  } = useCreditHistory()

  const tabs: TabsProps['tabs'] = useMemo(
    () => [
      { id: 'all', name: 'All' },
      { id: 'credit_expense', name: 'Expenses' },
      { id: 'token_transfer', name: 'Purchases' },
      { id: 'credit_transfer', name: 'Transfers' },
    ],
    [],
  )

  const handleTabChange = useCallback(
    (tabId: string) => {
      const tab = tabId as TabId
      setSelectedTab(tab)

      if (tab === 'all') {
        setFilters({ ...filters, payment_method: undefined })
      } else {
        setFilters({ ...filters, payment_method: tab })
      }
      setPage(1)
    },
    [filters, setFilters, setPage],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, search: e.target.value })
    },
    [filters, setFilters],
  )

  const displayEntries = useMemo(() => {
    if (selectedTab !== 'all') return filteredEntries

    return filteredEntries.filter((entry) => {
      if (entry.payment_method === 'credit_expense' && !showExpenses)
        return false
      if (entry.payment_method === 'token_transfer' && !showPurchases)
        return false
      if (entry.payment_method === 'credit_transfer' && !showTransfers)
        return false
      return true
    })
  }, [filteredEntries, selectedTab, showExpenses, showPurchases, showTransfers])

  const hasActiveFilters =
    !!filters.search ||
    !!filters.payment_method ||
    (selectedTab === 'all' &&
      (!showExpenses || !showPurchases || !showTransfers))

  const ellipseHash = (hash: string | null) => {
    if (!hash) return '-'
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  return (
    <section tw="px-0 pb-6 pt-6 lg:pb-5">
      <StyledSectionHeader>
        <SectionTitle>
          <span tw="flex items-center gap-3">
            Credit History
            {loading && <Spinner size="1.5em" color="main0" />}
          </span>
        </SectionTitle>
        <Button
          variant="secondary"
          kind="flat"
          tw="bg-white!"
          disabled={!isConnected}
          onClick={handleOpenTransferModal}
        >
          Transfer Credits
          <Icon name="exchange" />
        </Button>
      </StyledSectionHeader>

      <ToggleDashboard
        open={open}
        setOpen={setOpen}
        toggleButton={{
          children: (
            <>
              Show history <Icon name="clock" />
            </>
          ),
          disabled: !isConnected,
        }}
      >
        {/* Tabs */}
        <div tw="px-0 pb-3">
          <Tabs
            selected={selectedTab}
            align="left"
            onTabChange={handleTabChange}
            tabs={tabs}
          />
        </div>

        {/* Search + Checkboxes */}
        <div tw="flex flex-wrap gap-3 mb-4 items-center">
          {selectedTab === 'all' && (
            <>
              <Checkbox
                label="Expenses"
                checked={showExpenses}
                onChange={() => setShowExpenses(!showExpenses)}
                size="sm"
              />
              <Checkbox
                label="Purchases"
                checked={showPurchases}
                onChange={() => setShowPurchases(!showPurchases)}
                size="sm"
              />
              <Checkbox
                label="Transfers"
                checked={showTransfers}
                onChange={() => setShowTransfers(!showTransfers)}
                size="sm"
              />
            </>
          )}
          <div tw="flex-1 min-w-[12rem]">
            <TextInput
              name="credit-history-search"
              placeholder="Search..."
              value={filters.search || ''}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Table */}
        {displayEntries.length > 0 ? (
          <StyledScrollableTableContainer $maxHeight="32rem">
            <StyledTable
              rowKey={(row) => `${page}-${row.credit_ref}-${row.credit_index}`}
              data={displayEntries}
              columns={[
                {
                  label: 'DATE',
                  align: 'left',
                  sortable: true,
                  render: (row) =>
                    getDate(new Date(row.message_timestamp).getTime() / 1000),
                },
                {
                  label: 'TYPE',
                  align: 'left',
                  sortable: true,
                  render: (row) => {
                    const label =
                      PAYMENT_METHOD_LABELS[row.payment_method] ||
                      row.payment_method
                    const color =
                      PAYMENT_METHOD_COLORS[row.payment_method] || 'base2'
                    return (
                      <span tw="flex items-center gap-1.5">
                        <Icon name="circle" gradient={color} size="8px" />
                        {label}
                      </span>
                    )
                  },
                },
                {
                  label: 'AMOUNT',
                  align: 'right',
                  sortable: true,
                  render: (row) => {
                    const isNegative = row.amount < 0
                    return (
                      <span
                        style={{
                          color: isNegative ? '#ef4444' : '#22c55e',
                        }}
                      >
                        {formatCredits(row.amount)}
                      </span>
                    )
                  },
                },
                {
                  label: 'ORIGIN',
                  align: 'left',
                  render: (row) => (
                    <a
                      href={`https://explorer.aleph.im/address/ETH/${row.origin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      tw="flex items-center gap-1"
                      className="text-main0"
                    >
                      {ellipseHash(row.origin)}
                      <Icon name="external-link-square-alt" size="10px" />
                    </a>
                  ),
                },
                {
                  label: 'TX HASH',
                  align: 'left',
                  render: (row) =>
                    row.tx_hash ? (
                      <a
                        href={`https://etherscan.io/tx/${row.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        tw="flex items-center gap-1"
                        className="text-main0"
                      >
                        {ellipseHash(row.tx_hash)}
                        <Icon name="external-link-square-alt" size="10px" />
                      </a>
                    ) : (
                      '-'
                    ),
                },
                {
                  label: 'PROVIDER',
                  align: 'left',
                  render: (row) => row.provider,
                },
              ]}
            />
          </StyledScrollableTableContainer>
        ) : (
          <EmptyTablePlaceholder
            message={
              hasActiveFilters
                ? 'No entries match the current filters.'
                : 'No credit history entries found.'
            }
            hasFilters={hasActiveFilters}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div tw="flex items-center justify-center gap-4 mt-4">
            <Button
              color="main0"
              kind="functional"
              variant="secondary"
              size="md"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <Icon name="angle-left" />
            </Button>
            <span className="tp-body3">
              Page {page} of {totalPages}
            </span>
            <Button
              color="main0"
              kind="functional"
              variant="secondary"
              size="md"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <Icon name="angle-right" />
            </Button>
          </div>
        )}
      </ToggleDashboard>
    </section>
  )
}
CreditHistory.displayName = 'CreditHistory'

export default memo(CreditHistory)
