import React, { memo, useMemo, useState } from 'react'
import 'twin.macro'
import { Button, Icon, NoisyContainer, Spinner } from '@aleph-front/core'
import { StyledTable } from '@/components/common/EntityTable/styles'
import ToggleDashboard from '@/components/common/ToggleDashboard'
import { SectionTitle } from '@/components/common/CompositeTitle'
import PaymentHistoryPanel from '@/components/pages/console/DashboardPage/CreditsDashboard/PaymentHistoryPanel'
import { PaymentStatus } from '@/domain/credit'
import { getDate, formatPaymentAmount, formatCredits } from '@/helpers/utils'
import { getETHExplorerURL } from '@/helpers/utils'
import { useReportIssueModal } from '@/components/modals/ReportIssueModal'
import { StyledSectionHeader, StyledScrollableTableContainer } from '../styles'
import { RecentPurchasesProps } from './types'

const EmptyTablePlaceholder = ({ message }: { message: string }) => (
  <NoisyContainer tw="text-center py-8">
    <Icon name="info-circle" color="base2" size="lg" tw="mb-3" />
    <p className="text-base2 tp-body1">{message}</p>
  </NoisyContainer>
)

const RecentPurchases = ({
  isConnected,
  purchaseHistory,
  purchaseHistoryLoading,
  handleOpenTopUpModal,
  handleOpenPaymentStatusModal,
}: RecentPurchasesProps) => {
  const [open, setOpen] = useState(true)
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false)
  const { handleOpen: handleOpenReportIssue } = useReportIssueModal()

  const recentHistory = useMemo(
    () => purchaseHistory.slice(0, 5),
    [purchaseHistory],
  )

  return (
    <section tw="px-0 pb-6 pt-6 lg:pb-5">
      <StyledSectionHeader>
        <SectionTitle>
          <span tw="flex items-center gap-3">
            Purchases
            {purchaseHistoryLoading && <Spinner size="1.5em" color="main0" />}
          </span>
        </SectionTitle>
        <Button
          variant="secondary"
          kind="flat"
          tw="bg-white!"
          disabled={!isConnected}
          onClick={() => handleOpenTopUpModal()}
        >
          Top Up Balance
          <Icon name="credit-card" />
        </Button>
      </StyledSectionHeader>

      <ToggleDashboard
        open={open}
        setOpen={setOpen}
        toggleButton={{
          children: (
            <>
              Show purchases <Icon name="shopping-cart" />
            </>
          ),
          disabled: !isConnected,
        }}
      >
        {recentHistory.length > 0 ? (
          <>
            <StyledScrollableTableContainer $maxHeight="28rem">
              <StyledTable
                clickableRows
                rowKey={(row) => row.id}
                data={recentHistory}
                rowProps={(row) => ({
                  onClick: () => handleOpenPaymentStatusModal(row),
                })}
                columns={[
                  {
                    label: 'STATUS',
                    align: 'left',
                    sortable: true,
                    width: '1rem',
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
                      return <Icon name="circle" gradient={color} size="12px" />
                    },
                  },
                  {
                    label: 'DATE',
                    align: 'left',
                    sortable: true,
                    render: (row) =>
                      row.createdAt && getDate(row.createdAt / 1000),
                  },
                  {
                    label: 'AMOUNT',
                    align: 'left',
                    sortable: true,
                    render: (row) => formatPaymentAmount(row.amount, row.asset),
                  },
                  {
                    label: 'ASSET',
                    align: 'left',
                    sortable: true,
                    render: (row) => row.asset,
                  },
                  {
                    label: 'CREDITS',
                    align: 'left',
                    sortable: true,
                    render: (row) => `~${formatCredits(row.credits)}`,
                  },
                  {
                    label: 'TX',
                    align: 'right',
                    render: (row) => {
                      const url = row.txHash
                        ? getETHExplorerURL({ hash: row.txHash })
                        : undefined
                      return url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon
                            name="external-link-square-alt"
                            size="14px"
                            color="purple4"
                          />
                        </a>
                      ) : null
                    },
                  },
                ]}
              />
            </StyledScrollableTableContainer>
            <Button
              variant="textOnly"
              size="sm"
              tw="mt-4!"
              onClick={() => setIsHistoryPanelOpen(true)}
              disabled={!isConnected}
            >
              View Full History <Icon name="chevron-square-right" tw="ml-1" />
            </Button>
          </>
        ) : (
          <EmptyTablePlaceholder message="No purchases yet. Use the Top Up Balance button to add credits to your account." />
        )}
      </ToggleDashboard>

      <PaymentHistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={() => setIsHistoryPanelOpen(false)}
        payments={purchaseHistory}
        loading={purchaseHistoryLoading}
        onPaymentClick={handleOpenPaymentStatusModal}
        onReportIssue={handleOpenReportIssue}
      />
    </section>
  )
}
RecentPurchases.displayName = 'RecentPurchases'

export default memo(RecentPurchases)
