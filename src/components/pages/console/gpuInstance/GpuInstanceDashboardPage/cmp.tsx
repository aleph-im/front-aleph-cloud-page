import React from 'react'
import Head from 'next/head'
import { Tabs } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import GpuInstancesTabContent from '../GpuInstancesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { useGpuInstanceDashboardPage } from './hook'

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
      <Head>
        <title>GPU cloud computing | Aleph Cloud</title>
        <meta
          name="description"
          content="Scale AI, ML, and HPC workloads with powerful GPU instances on Aleph Cloud. On-demand pricing and decentralized infrastructure for maximum flexibility."
        />
      </Head>
      <CenteredContainer $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </CenteredContainer>
      <div role="tabpanel">
        {tabId === 'gpuInstances' ? (
          <>
            {!!gpuInstances?.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <GpuInstancesTabContent data={gpuInstances} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/instance.svg"
              imageAlt="Instance illustration"
              info="WHAT ARE..."
              title="GPU Instances"
              description="Power your workloads with high-performance GPU computing. Ideal for AI, ML, rendering, and complex simulations. Scale effortlessly and take full control over your GPU resources."
              withButton={gpuInstances?.length === 0}
              buttonUrl="/console/computing/gpu-instance/new"
              buttonText="Create a GPU Instance"
            />
          </>
        ) : (
          // ) : tabId === 'volume' ? (
          //   <>
          //     {!!volumes.length && (
          //       <CenteredContainer $variant="xl" tw="my-10">
          //         <VolumesTabContent data={volumes} cta={false} />
          //       </CenteredContainer>
          //     )}
          //   </>
          // ) : tabId === 'domain' ? (
          //   <>
          //     {!!domains.length && (
          //       <CenteredContainer $variant="xl" tw="my-10">
          //         <DomainsTabContent data={domains} cta={false} />
          //       </CenteredContainer>
          //     )}
          //   </>
          <></>
        )}
      </div>
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
    </>
  )
}
