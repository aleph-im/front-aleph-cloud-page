import React, { memo } from 'react'
import Head from 'next/head'
import { Tabs } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useFunctionDashboardPage } from './hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import FunctionsTabContent from '../../function/FunctionsTabContent'
import VolumesTabContent from '../../volume/VolumesTabContent'
import DomainsTabContent from '../../domain/DomainsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { NAVIGATION_URLS } from '@/helpers/constants'

function FunctionDashboardPage() {
  const { tabs, tabId, setTabId, programs, volumes, domains } =
    useFunctionDashboardPage()

  return (
    <>
      <Head>
        <title>Console | Functions | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your serverless functions on Aleph Cloud"
        />
      </Head>
      <CenteredContainer $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </CenteredContainer>
      <div role="tabpanel">
        {tabId === 'program' ? (
          <>
            {!!programs?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <FunctionsTabContent data={programs} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/function.svg"
              imageAlt="Function illustration"
              info="WHAT ARE..."
              title="Functions"
              description="Deploy and manage serverless functions effortlessly with our robust computing platform. Run code on-demand or persistently, with seamless integration and scalability."
              // withButton={programs?.length === 0}
              // buttonUrl="/console/computing/function/new"
              // buttonText="Create function"
              // externalLinkUrl={NAVIGATION_URLS.docs.functions}
              externalLinkText="Create on Legacy console"
              externalLinkUrl={
                NAVIGATION_URLS.legacyConsole.computing.functions.home
              }
            />
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} cta={false} />
              </CenteredContainer>
            )}
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} cta={false} />
              </CenteredContainer>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
    </>
  )
}

export default memo(FunctionDashboardPage)
