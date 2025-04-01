import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import WebsitesTabContent from '../../dashboard/WebsitesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useWebsiteDashboardPage } from '@/components/pages/hosting/WebsiteDashboardPage/hook'
import DomainsTabContent from '../../dashboard/DomainsTabContent'

export default function SettingsDashboardPage() {
  const { tabs, tabId, setTabId, websites, domains } = useWebsiteDashboardPage()

  return (
    <>
      {tabs.length ? (
        <Container $variant="xl" tw="my-10">
          <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
        </Container>
      ) : (
        <></>
      )}
      <div role="tabpanel">
        {tabId === 'website' ? (
          <>
            {!!websites?.length && (
              <Container $variant="xl" tw="my-10">
                <WebsitesTabContent data={websites} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/website.svg"
              imageAlt="Web3 Hosting illustration"
              info="HOW TO..."
              title="Host your Website!"
              description="Build and deploy your website effortlessly using our web3 hosting solutions. Support for static pages, Next.js, React, and Vue.js ensures you have the flexibility to create the perfect site."
              withButton={websites?.length === 0}
              buttonUrl="/hosting/website/new"
              buttonText="Deploy your website"
            />
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains?.length && (
              <Container $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} cta={false} />
              </Container>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <Container $variant="xl">
        <HoldTokenDisclaimer />
      </Container>
    </>
  )
}
