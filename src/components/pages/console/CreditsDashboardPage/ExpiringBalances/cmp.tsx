import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import 'twin.macro'
import { Icon, NoisyContainer, Spinner } from '@aleph-front/core'
import { StyledTable } from '@/components/common/EntityTable/styles'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { useAppState } from '@/contexts/appState'
import { getApiServer } from '@/helpers/server'
import { formatCredits, getDate } from '@/helpers/utils'
import { CreditHistoryEntry } from '@/hooks/common/useCreditHistory'
import { StyledScrollableTableContainer } from '../styles'
import { ExpiringBalancesProps } from './types'

const EmptyTablePlaceholder = ({ message }: { message: string }) => (
  <NoisyContainer tw="text-center py-8">
    <Icon name="info-circle" color="base2" size="lg" tw="mb-3" />
    <p className="text-base2 tp-body1">{message}</p>
  </NoisyContainer>
)

const ellipseHash = (hash: string | null | undefined) => {
  if (!hash || hash === 'None') return '-'
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

const ExpiringBalances = ({ isConnected }: ExpiringBalancesProps) => {
  const [open, setOpen] = useState(true)
  const [state] = useAppState()
  const { account } = state.connection

  const [entries, setEntries] = useState<CreditHistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchExpiringBalances = useCallback(async () => {
    if (!account?.address) return

    setLoading(true)
    try {
      const apiServer = getApiServer()
      let page = 1
      let hasMore = true
      const allEntries: CreditHistoryEntry[] = []

      while (hasMore) {
        const params = new URLSearchParams({
          pagination: '200',
          page: String(page),
          payment_method: 'credit_transfer',
        })

        const response = await fetch(
          `${apiServer}/api/v0/addresses/${account.address}/credit_history?${params}`,
        )

        if (!response.ok) break

        const data = await response.json()
        const items: CreditHistoryEntry[] = data.credit_history || []

        allEntries.push(...items)

        if (items.length < 200) {
          hasMore = false
        } else {
          page++
        }
      }

      setEntries(allEntries.filter((e) => !!e.expiration_date))
    } catch (err) {
      console.error('Error fetching expiring balances:', err)
    } finally {
      setLoading(false)
    }
  }, [account?.address])

  useEffect(() => {
    fetchExpiringBalances()
  }, [fetchExpiringBalances])

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const aDate = a.expiration_date
        ? new Date(a.expiration_date).getTime()
        : Infinity
      const bDate = b.expiration_date
        ? new Date(b.expiration_date).getTime()
        : Infinity
      return aDate - bDate
    })
  }, [entries])

  return (
    <section tw="px-0 pb-6 pt-6 lg:pb-5">
      <SectionTitle>
        <span tw="flex items-center gap-3">
          Expiring Balances
          {loading && <Spinner size="1.5em" color="main0" />}
        </span>
      </SectionTitle>
      <ToggleDashboard
        open={open}
        setOpen={setOpen}
        toggleButton={{
          children: (
            <>
              Show expiring balances <Icon name="hourglass-half" />
            </>
          ),
          disabled: !isConnected,
        }}
      >
        {sortedEntries.length > 0 ? (
          <StyledScrollableTableContainer $maxHeight="24rem">
            <StyledTable
              rowKey={(row) => `${row.credit_ref}-${row.credit_index}`}
              data={sortedEntries}
              columns={[
                {
                  label: 'AMOUNT',
                  align: 'right',
                  sortable: true,
                  render: (row) => (
                    <span style={{ color: '#22c55e' }}>
                      {formatCredits(row.amount)}
                    </span>
                  ),
                },
                {
                  label: 'FROM',
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
                  label: 'EXPIRES',
                  align: 'right',
                  sortable: true,
                  render: (row) => {
                    if (!row.expiration_date) return '-'
                    const expDate = new Date(row.expiration_date)
                    const isExpired = expDate.getTime() < Date.now()
                    return (
                      <span
                        style={{
                          color: isExpired ? '#ef4444' : undefined,
                        }}
                      >
                        {isExpired && (
                          <Icon
                            name="exclamation-triangle"
                            tw="mr-1"
                            size="12px"
                          />
                        )}
                        {getDate(expDate.getTime() / 1000)}
                      </span>
                    )
                  },
                },
                {
                  label: 'RECEIVED',
                  align: 'right',
                  sortable: true,
                  render: (row) =>
                    getDate(new Date(row.message_timestamp).getTime() / 1000),
                },
                {
                  label: '',
                  align: 'left' as const,
                  width: '100%',
                  render: () => null,
                },
              ]}
            />
          </StyledScrollableTableContainer>
        ) : (
          <EmptyTablePlaceholder message="No balances with expiration dates." />
        )}
      </ToggleDashboard>
    </section>
  )
}
ExpiringBalances.displayName = 'ExpiringBalances'

export default memo(ExpiringBalances)
