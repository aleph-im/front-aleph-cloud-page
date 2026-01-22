import React from 'react'
import {
  Button,
  Icon,
  Modal,
  NoisyContainer,
  ObjectImg,
  TextGradient,
} from '@aleph-front/core'

import { SectionTitle } from '@/components/common/CompositeTitle'
import { StyledTable } from '@/components/common/EntityTable/styles'

import ToggleDashboard from '@/components/common/ToggleDashboard'
import Skeleton from '@/components/common/Skeleton'
import PaymentStatusModal, {
  PaymentStatusModalHeader,
  PaymentStatusModalFooter,
} from '@/components/modals/PaymentStatusModal'
import PaymentHistoryPanel from './PaymentHistoryPanel'
import { useCreditsDashboard } from './hook'
import { PaymentStatus } from '@/domain/credit'
import { getDate, formatPaymentAmount } from '@/helpers/utils'
import { useReportIssueModal } from '@/components/modals/ReportIssueModal'
import DetailsMenuButton from '@/components/common/DetailsMenuButton'
import tw from 'twin.macro'

export default function CreditsDashboard() {
  const {
    runRateDays,
    creditsDashboardOpen,
    setCreditsDashboardOpen,
    isConnected,
    accountCreditBalance,
    isCalculatingCosts,
    history,
    historyLoading,
    recentHistory,
    isHistoryPanelOpen,
    setIsHistoryPanelOpen,
    displayedPayment,
    shouldModalBeOpen,
    handleOpenPaymentStatusModal,
    handleClosePaymentStatusModal,
    handleOpenTopUpModal,
  } = useCreditsDashboard()

  const { handleOpen: handleOpenReportIssue } = useReportIssueModal()

  return (
    <section tw="px-0 pb-6 pt-12 lg:pb-5">
      <SectionTitle>Balance</SectionTitle>
      <ToggleDashboard
        open={creditsDashboardOpen}
        setOpen={setCreditsDashboardOpen}
        toggleButton={{
          children: (
            <>
              Open balance <Icon name="credit-card" />
            </>
          ),
          disabled: !isConnected,
        }}
      >
        <div tw="flex flex-col gap-5">
          <NoisyContainer>
            <div tw="flex flex-wrap items-center justify-between gap-6">
              <div tw="flex flex-wrap gap-4 items-center">
                <ObjectImg id="Object20" color="main0" size={50} />

                <div tw="flex gap-3 items-center">
                  <div
                    className="bg-base1"
                    tw="flex flex-col items-start justify-between px-3 py-2 min-w-[6.875rem] min-h-[3.8125rem]"
                  >
                    <p className="tp-info text-base2">AVAILABLE</p>
                    {accountCreditBalance !== undefined ? (
                      <p className="text-main0 tp-h7">{accountCreditBalance}</p>
                    ) : (
                      <Skeleton width="3rem" height="1.5rem" />
                    )}
                  </div>
                  <div
                    className="bg-base1"
                    tw="flex flex-col items-start justify-between px-3 py-2 min-w-[6.875rem] min-h-[3.8125rem]"
                  >
                    <p className="tp-info text-base2">RUN-RATE</p>
                    {isCalculatingCosts ? (
                      <Skeleton width="4rem" height="1.5rem" />
                    ) : (
                      <div tw="flex items-end gap-0.5">
                        <p className="text-main0 tp-h7">{runRateDays || '∞'}</p>
                        <p className="text-main0 tp-info" tw="mb-1 ml-1">
                          {runRateDays === 1 ? 'DAY' : 'DAYS'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Button
                  variant="secondary"
                  kind="flat"
                  tw="bg-white!"
                  disabled={!isConnected}
                  onClick={() => handleOpenTopUpModal()}
                >
                  Top-up Balance
                  <Icon name="credit-card" />
                </Button>
              </div>
            </div>
          </NoisyContainer>

          <div>
            <div tw="flex gap-6 items-center">
              <TextGradient as="h3" type="h7">
                Purchases
              </TextGradient>

              <Button
                variant="textOnly"
                size="sm"
                tw="mb-7!"
                onClick={() => setIsHistoryPanelOpen(true)}
                disabled={!isConnected}
              >
                History <Icon name="chevron-square-right" tw="ml-1" />
              </Button>
            </div>
            <div tw="overflow-x-auto">
              <StyledTable
                // borderType="none"
                // rowNoise
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

                      return (
                        <div tw="relative h-6 w-6">
                          <Icon
                            name="circle"
                            gradient={color}
                            tw="absolute top-0 left-0"
                            size="24px"
                          ></Icon>
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
                    render: (row) =>
                      row.createdAt && getDate(row.createdAt / 1000),
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
                    render: (row) => `~${row.credits}`,
                  },
                  {
                    label: '',
                    width: '100%',
                    align: 'right',
                    render: () => <></>,
                  },
                  {
                    label: '',
                    width: '100%',
                    align: 'right',
                    render: (row) => {
                      return (
                        <DetailsMenuButton
                          menuItems={[
                            {
                              label: 'Report issue',
                              onClick: () =>
                                handleOpenReportIssue({ paymentId: row.id }),
                            },
                          ]}
                        />
                      )
                    },
                    cellProps: () => ({
                      css: tw`pl-3!`,
                    }),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </ToggleDashboard>

      {/* Payment History Panel */}
      <PaymentHistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={() => setIsHistoryPanelOpen(false)}
        payments={history}
        loading={historyLoading}
        onPaymentClick={handleOpenPaymentStatusModal}
        onReportIssue={handleOpenReportIssue}
      />

      {/* Payment Status Modal */}
      <Modal
        open={shouldModalBeOpen}
        onClose={handleClosePaymentStatusModal}
        width="40rem"
        header={
          displayedPayment && (
            <PaymentStatusModalHeader payment={displayedPayment} />
          )
        }
        content={
          displayedPayment && <PaymentStatusModal payment={displayedPayment} />
        }
        footer={
          displayedPayment && (
            <PaymentStatusModalFooter
              payment={displayedPayment}
              onClose={handleClosePaymentStatusModal}
            />
          )
        }
      />
    </section>
  )
}
