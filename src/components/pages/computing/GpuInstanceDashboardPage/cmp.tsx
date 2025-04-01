import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import GpuInstancesTabContent from '../../dashboard/GpuInstancesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useGpuInstanceDashboardPage } from '@/components/pages/computing/GpuInstanceDashboardPage/hook'

export default function GpuInstanceDashboardPage() {
  const {
    tabs,
    tabId,
    setTabId,
    gpuInstances,
    // , volumes, domains
  } = useGpuInstanceDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'gpuInstances' ? (
          <>
            {!!gpuInstances?.length && (
              <Container $variant="xl" tw="my-10">
                <GpuInstancesTabContent data={gpuInstances} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/instance.svg"
              imageAlt="Instance illustration"
              info="WHAT ARE..."
              title="GPU Instances"
              description="Power your workloads with high-performance GPU computing. Ideal for AI, ML, rendering, and complex simulations. Scale effortlessly and take full control over your GPU resources."
              withButton={gpuInstances?.length === 0}
              buttonUrl="/computing/gpu-instance/new"
              buttonText="Create a GPU Instance"
            />
          </>
        ) : (
          // ) : tabId === 'volume' ? (
          //   <>
          //     {!!volumes.length && (
          //       <Container $variant="xl" tw="my-10">
          //         <VolumesTabContent data={volumes} cta={false} />
          //       </Container>
          //     )}
          //   </>
          // ) : tabId === 'domain' ? (
          //   <>
          //     {!!domains.length && (
          //       <Container $variant="xl" tw="my-10">
          //         <DomainsTabContent data={domains} cta={false} />
          //       </Container>
          //     )}
          //   </>
          <></>
        )}
      </div>
      <Container $variant="xl">
        <HoldTokenDisclaimer />
      </Container>
    </>
  )
}
