import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import { useHostingWebsiteDashboardPage } from '@/hooks/pages/hosting/useHostingWebsiteDashboardPage'
import WebsitesTabContent from '../../dashboard/WebsitesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

export default function SettingsDashboardPage() {
  const { tabs, tabId, setTabId, websites } = useHostingWebsiteDashboardPage()

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
                <WebsitesTabContent
                  data={websites.sort((a, b) => b.date.localeCompare(a.date))}
                />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/web3hosting.svg"
              imageAlt="SSH Key illustration"
              info="HOW TO..."
              title="Create your Website!"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              buttonUrl="/hosting/website/new"
              buttonText="Create your website"
              externalLinkUrl="#"
            />
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
