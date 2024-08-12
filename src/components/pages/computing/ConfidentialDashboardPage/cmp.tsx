import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useConfidentialDashboardPage } from '@/hooks/pages/computing/useConfidentialDashboardPage'
import InstancesTabContent from '../../dashboard/InstancesTabContent'

export default function ConfidentialDashboardPage() {
  const { tabs, tabId, setTabId, confidentials, volumes, domains } =
    useConfidentialDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'confidential' ? (
          <>
            {!!confidentials.length && (
              <Container $variant="xl" tw="my-10">
                <InstancesTabContent data={confidentials} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/confidential.svg"
              imageAlt="Confidential illustration"
              info="WHAT IS A..."
              title="Confidential VM"
              description="[PENDING]"
              withButton={false}
            />
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <Container $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} cta={false} />
              </Container>
            )}
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
