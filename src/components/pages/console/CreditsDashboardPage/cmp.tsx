import React from 'react'
import 'twin.macro'
import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useCreditsDashboardPage } from './hook'
import CreditStatsHeader from './CreditStatsHeader'
import RecentPurchases from './RecentPurchases'
import CreditHistory from './CreditHistory'
import ServiceCosts from './ServiceCosts'
import ExpiringBalances from './ExpiringBalances'

export default function CreditsDashboardPage() {
  const {
    isConnected,
    accountAddress,
    accountCreditBalance,
    knownCrnHashes,
    costsSummary,
    costsResources,
    costsLoading,
    purchaseHistory,
    purchaseHistoryLoading,
    handleOpenTopUpModal,
    handleOpenPaymentStatusModal,
    handleOpenTransferModal,
  } = useCreditsDashboardPage()

  return (
    <>
      <Head>
        <title>Credits | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your Aleph Cloud credits. View balance, track expenses, transfer credits, and monitor service costs."
        />
      </Head>
      <CenteredContainer $variant="xl">
        <CreditStatsHeader
          isConnected={isConnected}
          accountCreditBalance={accountCreditBalance}
          costsSummary={costsSummary}
          costsResources={costsResources}
          costsLoading={costsLoading}
        />

        <RecentPurchases
          isConnected={isConnected}
          purchaseHistory={purchaseHistory}
          purchaseHistoryLoading={purchaseHistoryLoading}
          handleOpenTopUpModal={handleOpenTopUpModal}
          handleOpenPaymentStatusModal={handleOpenPaymentStatusModal}
        />

        <CreditHistory
          isConnected={isConnected}
          accountAddress={accountAddress}
          knownCrnHashes={knownCrnHashes}
          handleOpenTransferModal={handleOpenTransferModal}
        />

        <ServiceCosts
          isConnected={isConnected}
          costsResources={costsResources}
          costsLoading={costsLoading}
        />

        <ExpiringBalances isConnected={isConnected} />
      </CenteredContainer>
    </>
  )
}
