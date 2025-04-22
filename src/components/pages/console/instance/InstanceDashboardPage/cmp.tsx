import React from 'react'
import { Tabs } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useInstanceDashboardPage } from './hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import InstancesTabContent from '../InstancesTabContent'
import VolumesTabContent from '../../volume/VolumesTabContent'
import DomainsTabContent from '../../domain/DomainsTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

export default function InstanceDashboardPage() {
  const { tabs, tabId, setTabId, instances, volumes, domains } =
    useInstanceDashboardPage()

  return (
    <>
      <CenteredContainer $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </CenteredContainer>
      <div role="tabpanel">
        {tabId === 'instance' ? (
          <>
            {!!instances?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <InstancesTabContent data={instances} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/instance.svg"
              imageAlt="Instance illustration"
              info="WHAT ARE..."
              title="Instances"
              description="Launch and control virtual private servers (VPS) with ease. Choose between automatic or manual node selection, and customize your computing environment to meet your specific needs."
              withButton={instances?.length === 0}
              buttonUrl="/console/computing/instance/new"
              buttonText="Create instance"
            />
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} cta={false} />
              </CenteredContainer>
            )}
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains.length && (
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
