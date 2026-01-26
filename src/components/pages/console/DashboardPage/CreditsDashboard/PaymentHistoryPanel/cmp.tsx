import React, { memo, useState, useMemo } from 'react'
import { Button, Icon } from '@aleph-front/core'
import { SidePanel } from '@/components/common/SidePanel/cmp'
import { StyledTable } from '@/components/common/EntityTable/styles'
import { PaymentStatus } from '@/domain/credit'
import { PaymentHistoryPanelProps } from './types'
import { formatPaymentAmount, getDate, formatCredits } from '@/helpers/utils'

export const PaymentHistoryPanel = ({
  isOpen,
  onClose,
  payments,
  loading,
  onPaymentClick,
}: PaymentHistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        payment.credits.toString().includes(query) ||
        payment.asset.toLowerCase().includes(query) ||
        payment.amount.toString().includes(query)
      )
    })
  }, [payments, searchQuery])

  return (
    <SidePanel title="Payment History" isOpen={isOpen} onClose={onClose}>
      <div tw="space-y-4">
        {/* Search/Filter Section */}
        <div tw="flex gap-4 items-center">
          <div tw="flex-1 relative">
            <Icon
              name="search"
              className="text-base2"
              tw="absolute left-3 top-1/2 transform -translate-y-1/2"
              size="16px"
            />
            <input
              type="text"
              placeholder="Filter by amount, asset, or credits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              tw="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <Button
              variant="textOnly"
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="tp-info text-base2">
            {filteredPayments.length} result
            {filteredPayments.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Payments Table */}
        <div tw="overflow-x-auto">
          <StyledTable
            rowKey={(row) => row.id}
            data={filteredPayments}
            rowProps={(row) => ({
              onClick: () => onPaymentClick(row),
            })}
            columns={[
              {
                label: 'STATUS',
                align: 'left',
                sortable: true,
                width: 'auto',
                render: (row) => {
                  let color = 'warning'

                  switch (row.status) {
                    case PaymentStatus.Completed:
                      color = 'success'
                      break
                    case PaymentStatus.Cancelled:
                    case PaymentStatus.Failed:
                      color = 'error'
                      break
                    default:
                      color = 'warning'
                      break
                  }

                  return (
                    <div tw="relative h-6 w-6">
                      <Icon
                        name="circle"
                        gradient={color}
                        tw="absolute top-0 left-0"
                        size="24px"
                      />
                      <Icon
                        name="circle"
                        color="base0"
                        tw="absolute top-[1.5px] left-[1.5px]"
                        size="21px"
                      />
                      <Icon
                        name="alien-8bit"
                        gradient={color}
                        tw="absolute top-[4px] left-[3px]"
                        size="16px"
                      />
                    </div>
                  )
                },
              },
              {
                label: 'DATE',
                align: 'left',
                sortable: true,
                width: '10rem',
                render: (row) => row.createdAt && getDate(row.createdAt / 1000),
              },
              {
                label: 'AMOUNT',
                align: 'left',
                sortable: true,
                width: '8rem',
                render: (row) => formatPaymentAmount(row.amount, row.asset),
              },
              {
                label: 'ASSET',
                align: 'left',
                sortable: true,
                width: '6rem',
                render: (row) => row.asset,
              },
              {
                label: 'CREDITS',
                align: 'left',
                sortable: true,
                width: '8rem',
                render: (row) => `~${formatCredits(row.credits)}`,
              },
              {
                label: '',
                width: '100%',
                align: 'right',
                render: () => <></>,
              },
              /* TODO: Re-enable when report issue functionality is implemented
              {
                label: '',
                width: '100%',
                align: 'right',
                render: () => {
                  return (
                    <DetailsMenuButton
                      menuItems={[{ label: 'Report issue', href: '/' }]}
                    />
                  )
                },
                cellProps: () => ({
                  css: tw`pl-3!`,
                }),
              },
              */
            ]}
          />
        </div>

        {filteredPayments.length === 0 && !loading && (
          <div tw="text-center py-8">
            <p className="tp-body1 text-base2">
              {searchQuery
                ? 'No payments found matching your search.'
                : 'No payment history available.'}
            </p>
          </div>
        )}

        {loading && (
          <div tw="text-center py-8">
            <p className="tp-body1 text-base2">Loading payment history...</p>
          </div>
        )}
      </div>
    </SidePanel>
  )
}

PaymentHistoryPanel.displayName = 'PaymentHistoryPanel'

export default memo(PaymentHistoryPanel)
