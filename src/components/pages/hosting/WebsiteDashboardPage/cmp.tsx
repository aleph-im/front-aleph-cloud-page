import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import WebsitesTabContent from '../../dashboard/WebsitesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useWebsiteDashboardPage } from '@/hooks/pages/hosting/useWebsiteDashboardPage'
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
            {!!websites.length && (
              <Container $variant="xl" tw="my-10">
                <WebsitesTabContent data={websites} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/website.svg"
              imageAlt="Web3 Hosting illustration"
              info="HOW TO..."
              title="Create your Website!"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              buttonUrl="/hosting/website/new"
              buttonText="Create your website"
              externalLinkUrl="#"
            />
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains.length && (
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
