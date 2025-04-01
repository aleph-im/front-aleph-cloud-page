import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useInstanceDashboardPage } from '@/components/pages/computing/InstanceDashboardPage/hook'
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
            {!!instances?.length && (
              <Container $variant="xl" tw="my-10">
                <InstancesTabContent data={instances} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/instance.svg"
              imageAlt="Instance illustration"
              info="WHAT ARE..."
              title="Instances"
              description="Launch and control virtual private servers (VPS) with ease. Choose between automatic or manual node selection, and customize your computing environment to meet your specific needs."
              withButton={instances?.length === 0}
              buttonUrl="/computing/instance/new"
              buttonText="Create instance"
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
