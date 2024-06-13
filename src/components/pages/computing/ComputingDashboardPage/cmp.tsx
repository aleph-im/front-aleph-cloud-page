import React from 'react'
import { Icon } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useComputingDashboardPage } from '@/hooks/pages/computing/useComputingDashboardPage'
import EntityCard from '@/components/common/EntityCard'
import { SectionTitle } from '@/components/common/CompositeTitle'

export default function ComputingDashboardPage() {
  const { tabs, tabId, setTabId, instances, programs } =
    useComputingDashboardPage()

  return (
    <>
      <Container $variant="xl">
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="1">
            Computing <Icon name="settings" color="main0" />
          </SectionTitle>
          <div tw="mt-3 flex gap-6 items-stretch">
            <EntityCard
              title="functions"
              img="Object10"
              link="/computing/function/new"
              entity="function"
            >
              An isolated environment created for a function to execute in
              response to an event and can run in two modes: on-demand or
              persistent.
            </EntityCard>
            <EntityCard
              title="instance"
              img="Object11"
              link="/computing/instance/new"
              entity="instance"
            >
              A virtual machine that runs on a Aleph.im&apos;s infrastructure
              and can be configured with CPUs, memory, storage, and networking
            </EntityCard>
            {/* <EntityCard
              title="confidential VM"
              img="Object9"
              link="#"
              entity="confidential"
            >
              A virtual machine running for an extended period with their
              memory, storage, and execution fully encrypted and isolated from
              the host.
            </EntityCard> */}
          </div>
        </section>
      </Container>
    </>
  )
}
