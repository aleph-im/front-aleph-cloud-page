import React from 'react'
import { Tabs } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import WebsitesTabContent from '../WebsitesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useWebsiteDashboardPage } from '@/components/pages/console/website/WebsiteDashboardPage/hook'
import DomainsTabContent from '../../domain/DomainsTabContent'
import { NAVIGATION_URLS } from '@/helpers/constants'
import Head from 'next/head'

export default function WebsiteDashboardPage() {
  const { tabs, tabId, setTabId, websites, domains } = useWebsiteDashboardPage()

  return (
    <>
      <Head>
        <title>Host decentralized Websites | Aleph Cloud</title>
        <meta
          name="description"
          content="Build and deploy your website with Aleph Cloud’s Web3 hosting. Enjoy secure, censorship-resistant hosting with support for static sites and modern frameworks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {tabs.length ? (
        <CenteredContainer $variant="xl" tw="my-10">
          <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
        </CenteredContainer>
      ) : (
        <></>
      )}
      <div role="tabpanel">
        {tabId === 'website' ? (
          <>
            {!!websites?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <WebsitesTabContent data={websites} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/website.svg"
              imageAlt="Web3 Hosting illustration"
              info="HOW TO..."
              title="Host your Website!"
              description="Build and deploy your website effortlessly using our web3 hosting solutions. Support for static pages, Next.js, React, and Vue.js ensures you have the flexibility to create the perfect site."
              withButton={websites?.length === 0}
              buttonUrl={NAVIGATION_URLS.console.web3Hosting.website.new}
              buttonText="Deploy your website"
            />
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
