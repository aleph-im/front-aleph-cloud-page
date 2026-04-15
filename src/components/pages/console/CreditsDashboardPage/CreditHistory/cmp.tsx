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
import {
  useCreditHistory,
  CreditHistoryEntry,
} from '@/hooks/common/useCreditHistory'
import { ALEPH_CREDIT_SENDER } from '@/domain/credit'
import { formatCredits, getDate } from '@/helpers/utils'
import { StyledSectionHeader, StyledScrollableTableContainer } from '../styles'
import { CreditHistoryProps } from './types'

type TabId = 'all' | 'credit_transfer' | 'credit_expense' | 'token_transfer'

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

const ellipseHash = (hash: string | null | undefined) => {
  if (!hash || hash === 'None') return '-'
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

// Proper Aleph Explorer URL: /address/{chain}/{sender}/message/{type}/{hash}
const alephExplorerUrl = (hash: string, sender: string, msgType = 'POST') =>
  `https://explorer.aleph.im/address/ETH/${sender}/message/${msgType}/${hash}`

const HashLink = ({
  hash,
  href,
}: {
  hash: string | null | undefined
  href?: string
}) => {
  if (!hash || hash === 'None') return <span>-</span>
  const url = href || '#'
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      tw="flex items-center gap-1"
      className="text-main0"
    >
      {ellipseHash(hash)}
      <Icon name="external-link-square-alt" size="10px" />
    </a>
  )
}

const EtherscanLink = ({ hash }: { hash: string | null | undefined }) => {
  if (!hash || hash === 'None') return <span>-</span>
  return <HashLink hash={hash} href={`https://etherscan.io/tx/${hash}`} />
}

const AddressLink = ({ address }: { address: string | null | undefined }) => {
  if (!address || address === 'None') return <span>-</span>
  return (
    <HashLink
      hash={address}
      href={`https://explorer.aleph.im/address/ETH/${address}`}
    />
  )
}

const AmountCell = ({ amount }: { amount: number }) => (
  <span style={{ color: amount < 0 ? '#ef4444' : '#22c55e' }}>
    {formatCredits(amount)}
  </span>
)

// --- Column definitions per tab ---

const allColumns = () => [
  {
    label: 'TYPE',
    align: 'left' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) => {
      const labels: Record<string, string> = {
        credit_expense: 'Expense',
        token_transfer: 'Purchase',
        credit_transfer: 'Transfer',
      }
      const colors: Record<string, string> = {
        credit_expense: 'error',
        token_transfer: 'success',
        credit_transfer: 'info',
      }
      return (
        <span tw="flex items-center gap-1.5">
          <Icon
            name="circle"
            gradient={colors[row.payment_method] || 'base2'}
            size="8px"
          />
          {labels[row.payment_method] || row.payment_method}
        </span>
      )
    },
  },
  {
    label: 'AMOUNT',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) => <AmountCell amount={row.amount} />,
  },
  {
    label: 'DATE',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) =>
      getDate(new Date(row.message_timestamp).getTime() / 1000),
  },
  {
    label: '',
    align: 'left' as const,
    width: '100%',
    render: () => null,
  },
]

// Expenses:
// For VMs: origin = resource (INSTANCE msg), tx_hash = CRN node hash
// For volumes: origin_ref = resource (STORE msg), no CRN
const expenseColumns = (
  accountAddress?: string,
  knownCrnHashes?: Set<string>,
) => [
  {
    label: 'AMOUNT',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) => <AmountCell amount={row.amount} />,
  },
  {
    label: 'RESOURCE',
    align: 'left' as const,
    render: (row: CreditHistoryEntry) => {
      const isVolume = !row.tx_hash || row.tx_hash === 'None'
      if (isVolume) {
        return row.origin_ref && row.origin_ref !== 'None' ? (
          <HashLink
            hash={row.origin_ref}
            href={alephExplorerUrl(
              row.origin_ref,
              accountAddress || '',
              'STORE',
            )}
          />
        ) : (
          <span>-</span>
        )
      }
      return row.origin && row.origin !== 'None' ? (
        <HashLink
          hash={row.origin}
          href={alephExplorerUrl(row.origin, accountAddress || '', 'INSTANCE')}
        />
      ) : (
        <span>-</span>
      )
    },
  },
  {
    label: 'CRN NODE',
    align: 'left' as const,
    render: (row: CreditHistoryEntry) => {
      const isVolume = !row.tx_hash || row.tx_hash === 'None'
      if (isVolume) return <span>-</span>
      if (!row.tx_hash || row.tx_hash === 'None') return <span>-</span>

      // If the CRN is in the app state, link in-app
      const isKnown = knownCrnHashes?.has(row.tx_hash)
      if (isKnown) {
        return (
          <a
            href={`/account/earn/crn/${row.tx_hash}`}
            tw="flex items-center gap-1"
            className="text-main0"
          >
            {ellipseHash(row.tx_hash)}
            <Icon name="angle-right" size="10px" />
          </a>
        )
      }

      // Otherwise link to explorer
      return (
        <HashLink
          hash={row.tx_hash}
          href={`https://explorer.aleph.im/address/ETH/${row.tx_hash}`}
        />
      )
    },
  },
  {
    label: 'DATE',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) =>
      getDate(new Date(row.message_timestamp).getTime() / 1000),
  },
  {
    label: '',
    align: 'left' as const,
    width: '100%',
    render: () => null,
  },
]

const transferColumns = (accountAddress?: string) => [
  {
    label: 'AMOUNT',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) => <AmountCell amount={row.amount} />,
  },
  {
    label: 'SENDER',
    align: 'left' as const,
    render: (row: CreditHistoryEntry) => {
      const sender = row.amount >= 0 ? row.origin : accountAddress || 'You'
      return sender === accountAddress ? (
        <span className="text-base2">You</span>
      ) : (
        <AddressLink address={sender} />
      )
    },
  },
  {
    label: 'RECEIVER',
    align: 'left' as const,
    render: (row: CreditHistoryEntry) => {
      const receiver = row.amount < 0 ? row.origin : accountAddress || 'You'
      return receiver === accountAddress ? (
        <span className="text-base2">You</span>
      ) : (
        <AddressLink address={receiver} />
      )
    },
  },
  {
    label: 'EXPIRATION',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) =>
      row.expiration_date
        ? getDate(new Date(row.expiration_date).getTime() / 1000)
        : '-',
  },
  {
    label: 'DATE',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) =>
      getDate(new Date(row.message_timestamp).getTime() / 1000),
  },
  {
    label: '',
    align: 'left' as const,
    width: '100%',
    render: () => null,
  },
]

const purchaseColumns = () => [
  {
    label: 'AMOUNT',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) => (
      <span style={{ color: '#22c55e' }}>{formatCredits(row.amount)}</span>
    ),
  },
  {
    label: 'BONUS',
    align: 'right' as const,
    render: (row: CreditHistoryEntry) =>
      row.bonus_amount ? (
        <span style={{ color: '#22c55e' }}>
          +{formatCredits(row.bonus_amount)}
        </span>
      ) : (
        '-'
      ),
  },
  {
    label: 'PRICE/CREDIT',
    align: 'right' as const,
    render: (row: CreditHistoryEntry) =>
      row.price ? `$${parseFloat(row.price).toFixed(6)}` : '-',
  },
  {
    label: 'PAYMENT TX',
    align: 'left' as const,
    render: (row: CreditHistoryEntry) => <EtherscanLink hash={row.tx_hash} />,
  },
  {
    label: 'PAYMENT MSG',
    align: 'left' as const,
    render: (row: CreditHistoryEntry) =>
      row.origin_ref && row.origin_ref !== 'None' ? (
        <HashLink
          hash={row.origin_ref}
          href={alephExplorerUrl(row.origin_ref, ALEPH_CREDIT_SENDER, 'POST')}
        />
      ) : (
        <span>-</span>
      ),
  },
  {
    label: 'DATE',
    align: 'right' as const,
    sortable: true,
    render: (row: CreditHistoryEntry) =>
      getDate(new Date(row.message_timestamp).getTime() / 1000),
  },
  {
    label: '',
    align: 'left' as const,
    width: '100%',
    render: () => null,
  },
]

// --- Main component ---

const CreditHistory = ({
  isConnected,
  accountAddress,
  knownCrnHashes,
  handleOpenTransferModal,
}: CreditHistoryProps) => {
  const [open, setOpen] = useState(true)
  const [selectedTab, setSelectedTab] = useState<TabId>('all')

  const [showIncoming, setShowIncoming] = useState(true)
  const [showOutgoing, setShowOutgoing] = useState(true)

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
      { id: 'credit_transfer', name: 'Transfers' },
      { id: 'credit_expense', name: 'Expenses' },
      { id: 'token_transfer', name: 'Purchases' },
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

  const showDirectionFilter =
    selectedTab === 'all' || selectedTab === 'credit_transfer'

  const displayEntries = useMemo(() => {
    let entries = filteredEntries

    if (showDirectionFilter) {
      entries = entries.filter((entry) => {
        if (entry.amount >= 0 && !showIncoming) return false
        if (entry.amount < 0 && !showOutgoing) return false
        return true
      })
    }

    return entries
  }, [filteredEntries, showDirectionFilter, showIncoming, showOutgoing])

  const hasActiveFilters =
    !!filters.search ||
    (showDirectionFilter && (!showIncoming || !showOutgoing))

  const columns = useMemo(() => {
    switch (selectedTab) {
      case 'credit_expense':
        return expenseColumns(accountAddress, knownCrnHashes)
      case 'credit_transfer':
        return transferColumns(accountAddress)
      case 'token_transfer':
        return purchaseColumns()
      default:
        return allColumns()
    }
  }, [selectedTab, accountAddress, knownCrnHashes])

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

        {/* Search + Direction checkboxes */}
        <div tw="flex flex-wrap gap-3 mb-4 items-center">
          <div tw="flex-1 min-w-[12rem]">
            <TextInput
              name="credit-history-search"
              placeholder="Search..."
              value={filters.search || ''}
              onChange={handleSearchChange}
            />
          </div>
          {showDirectionFilter && (
            <div tw="flex gap-2 items-center">
              <Checkbox
                label="In"
                checked={showIncoming}
                onChange={() => setShowIncoming(!showIncoming)}
                size="xs"
                css="gap: 0.25rem; font-size: 0.75rem;"
              />
              <Checkbox
                label="Out"
                checked={showOutgoing}
                onChange={() => setShowOutgoing(!showOutgoing)}
                size="xs"
                css="gap: 0.25rem; font-size: 0.75rem;"
              />
            </div>
          )}
        </div>

        {/* Table */}
        {displayEntries.length > 0 ? (
          <StyledScrollableTableContainer $maxHeight="32rem">
            <StyledTable
              rowKey={(row) => `${page}-${row.credit_ref}-${row.credit_index}`}
              data={displayEntries}
              columns={columns}
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
