import React from 'react'
import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useInstanceDashboardPage } from './hook'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import InstancesTabContent from '../InstancesTabContent'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'

export default function InstanceDashboardPage() {
  const { instances } = useInstanceDashboardPage()

  return (
    <>
      <Head>
        <title>Console | Instances | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your virtual machine instances on Aleph Cloud"
        />
      </Head>
      <div>
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
      </div>
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
    </>
  )
}
