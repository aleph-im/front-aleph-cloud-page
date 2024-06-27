import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useInstanceDashboardPage } from '@/hooks/pages/computing/useInstanceDashboardPage'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import InstancesTabContent from '../../dashboard/InstancesTabContent'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

export default function InstanceDashboardPage() {
  const { tabs, tabId, setTabId, instances, volumes, domains } =
    useInstanceDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'instance' ? (
          <>
            {!!instances.length && (
              <Container $variant="xl" tw="my-10">
                <InstancesTabContent data={instances} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/instance.svg"
              imageAlt="Instance illustration"
              info="WHAT IS AN..."
              title="Instance"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              withButton={instances.length === 0}
              buttonUrl="/computing/function/new"
              buttonText="Create instance"
              externalLinkUrl="https://docs.aleph.im/computing/#persistent-execution"
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
