import React, { useMemo } from 'react'
import { Icon } from '@aleph-front/core'
import { useDashboardPage } from '@/hooks/pages/solutions/useDashboardPage'
import { SectionTitle } from '@/components/common/CompositeTitle'
import Container from '@/components/common/CenteredContainer'
import EntityCard from '@/components/common/EntityCard'
import { HoldTokenDisclaimer } from '@/components/common/HoldTokenDisclaimer/cmp'
import { EntityCardItemProps } from '@/components/common/EntityCard/types'
import { EntityCardWrapper, StyledEntityCardsContainer } from './styles'

export default function DashboardPage() {
  const {
    instanceAggregatedStatus,
    programAggregatedStatus,
    volumesAggregatedStatus,
    websitesAggregatedStatus,
  } = useDashboardPage()

  const programsCardItems = useMemo(() => {
    if (!programAggregatedStatus.total.amount) return []

    return [
      {
        title: 'persistent',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        information: {
          type: 'computing',
          data: programAggregatedStatus.persistent,
        },
      },
      {
        title: 'on demand',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        information: {
          type: 'computing',
          data: programAggregatedStatus.onDemand,
        },
      },
    ] as EntityCardItemProps[]
  }, [programAggregatedStatus])

  const volumesCardItems = useMemo(() => {
    if (!volumesAggregatedStatus.total.amount) return []

    return [
      {
        title: 'linked',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        information: {
          type: 'storage',
          data: volumesAggregatedStatus.linked,
        },
      },
      {
        title: 'unlinked',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        information: {
          type: 'storage',
          data: volumesAggregatedStatus.unlinked,
        },
      },
    ] as EntityCardItemProps[]
  }, [volumesAggregatedStatus])

  return (
    <>
      <Container $variant="xl">
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="1">
            Web3 Hosting
            <Icon name="web3HostingBox" color="main0" size="0.66em" tw="ml-2" />
          </SectionTitle>
          <StyledEntityCardsContainer tw="mt-3">
            <EntityCardWrapper>
              <EntityCard
                tw="overflow-scroll"
                type={
                  programAggregatedStatus.total.amount
                    ? 'active'
                    : 'introduction'
                }
                title="Websites"
                img="Object20"
                description="Deploy and manage your websites with ease. Support for static pages, Next.js, React, and Vue.js ensures you can create dynamic and robust web experiences."
                introductionButtonText="Deploy your website"
                dashboardPath="/hosting/website"
                createPath="/hosting/website/new"
                information={{
                  type: 'amount',
                  data: websitesAggregatedStatus.total,
                }}
              />
            </EntityCardWrapper>
          </StyledEntityCardsContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="2">
            Computing
            <Icon
              name="computeSolutions"
              color="main0"
              size="0.66em"
              tw="ml-2"
            />
          </SectionTitle>
          <StyledEntityCardsContainer tw="mt-3">
            <EntityCardWrapper>
              <EntityCard
                type={
                  programAggregatedStatus.total.amount
                    ? 'active'
                    : 'introduction'
                }
                title="functions"
                img="Object10"
                description="Run code on-demand or persistently with our serverless computing platform. Scale effortlessly and integrate seamlessly."
                introductionButtonText="Create your function"
                dashboardPath="/computing/function"
                createPath="/computing/function/new"
                information={{
                  type: 'amount',
                  data: programAggregatedStatus.total,
                }}
                subItems={programsCardItems}
              />
            </EntityCardWrapper>
            <EntityCardWrapper>
              <EntityCard
                type={
                  instanceAggregatedStatus.total.amount
                    ? 'active'
                    : 'introduction'
                }
                title="instance"
                img="Object11"
                description="Launch and manage virtual private servers (VPS) tailored to your needs. Choose automatic or manual node selection for complete control over your computing environment."
                introductionButtonText="Create your instance"
                dashboardPath="/computing/instance"
                createPath="/computing/instance/new"
                information={{
                  type: 'computing',
                  data: instanceAggregatedStatus.total,
                }}
              />
            </EntityCardWrapper>
            <EntityCardWrapper>
              <EntityCard
                type={'introduction'}
                isComingSoon
                title="confidentials"
                img="Object9"
                description="Protect your sensitive workloads with our Confidential VMs. Designed for maximum privacy and security, ensuring your data stays safe."
                introductionButtonText="Create your confidential"
                information={{
                  type: 'computing',
                }}
              />
            </EntityCardWrapper>
          </StyledEntityCardsContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="3">
            Storage
            <Icon
              name="storageSolutions"
              color="main0"
              size="0.66em"
              tw="ml-2"
            />
          </SectionTitle>
          <StyledEntityCardsContainer tw="mt-6">
            <EntityCardWrapper>
              <EntityCard
                type={
                  volumesAggregatedStatus.total.amount
                    ? 'active'
                    : 'introduction'
                }
                title="volumes"
                img="Object15"
                dashboardPath="/storage"
                createPath="/storage/volume/new"
                description="Secure and reliable immutable volumes for your data storage needs. Ideal for dependency volumes and critical data, ensuring consistency and integrity."
                introductionButtonText="Create your volume"
                information={{
                  type: 'storage',
                  data: volumesAggregatedStatus.total,
                }}
                subItems={volumesCardItems}
              />
            </EntityCardWrapper>
          </StyledEntityCardsContainer>
        </section>
      </Container>
      <Container $variant="xl">
        <HoldTokenDisclaimer />
      </Container>
    </>
  )
}
