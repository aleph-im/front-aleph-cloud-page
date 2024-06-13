import React from 'react'
import { Icon } from '@aleph-front/core'
import { useDashboardPage } from '@/hooks/pages/solutions/useDashboardPage'
import { useSPARedirect } from '@/hooks/common/useSPARedirect'
import { SectionTitle } from '@/components/common/CompositeTitle'
import Container from '@/components/common/CenteredContainer'
import EntityCard from '@/components/common/EntityCard'

export default function DashboardPage() {
  useSPARedirect()

  const { all, programs, instances, volumes, sshKeys, domains, websites } =
    useDashboardPage()

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
            <EntityCard
              title="confidential VM"
              img="Object9"
              link="#"
              entity="confidential"
            >
              A virtual machine running for an extended period with their
              memory, storage, and execution fully encrypted and isolated from
              the host.
            </EntityCard>
          </div>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="2">Storage</SectionTitle>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum
            dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula
            in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante
            non elit. 
          </p>
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
            <EntityCard
              title="confidential VM"
              img="Object9"
              link="#"
              entity="confidential"
            >
              A virtual machine running for an extended period with their
              memory, storage, and execution fully encrypted and isolated from
              the host.
            </EntityCard>
          </div>
        </section>
      </Container>
    </>
  )
}
