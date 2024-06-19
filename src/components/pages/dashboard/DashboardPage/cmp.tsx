import React, { useMemo } from 'react'
import { Icon } from '@aleph-front/core'
import { useDashboardPage } from '@/hooks/pages/solutions/useDashboardPage'
import { SectionTitle } from '@/components/common/CompositeTitle'
import Container from '@/components/common/CenteredContainer'
import EntityCard from '@/components/common/EntityCard'
import EntitySummaryCard from '@/components/common/EntitySummaryCard'
import { HoldTokenDisclaimer } from '@/components/common/HoldTokenDisclaimer/cmp'
import { EntityCardItemProps } from '@/components/common/EntityCard/types'

export default function DashboardPage() {
  const { cardType, instanceAggregatedStatus, programAggregatedStatus } =
    useDashboardPage()

  const volumesCardItems = useMemo(() => {
    if (cardType !== 'active') return []

    return [
      {
        title: 'linked',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        information: {
          type: 'storage',
          data: {
            storage: 0,
            amount: 0,
          },
        },
      },
      {
        title: 'unlinked',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        information: {
          type: 'storage',
          data: {
            storage: 0,
            amount: 0,
          },
        },
      },
    ] as EntityCardItemProps[]
  }, [cardType])

  return (
    <>
      <Container $variant="xl">
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="0">Currently running</SectionTitle>
          <div tw="mt-3 flex gap-6 items-stretch flex-wrap">
            <EntitySummaryCard
              items={[
                {
                  title: 'functions',
                  img: 'Object10',
                  information: {
                    type: 'computing',
                    data: {
                      running: 1,
                    },
                  },
                },
              ]}
            />
            {/* <EntitySummaryCard title="functions" img="Object10" running={1} />
            <EntitySummaryCard title="instances" img="Object10" running={6} /> */}
            <EntitySummaryCard
              items={[
                {
                  title: 'instances',
                  img: 'Object11',
                  information: {
                    type: 'computing',
                    data: {
                      running: 6,
                    },
                  },
                },
              ]}
            />
          </div>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="1">
            Computing <Icon name="settings" color="main0" size="0.66em" />
          </SectionTitle>
          <div tw="mt-3 flex gap-6 items-stretch flex-wrap">
            <EntityCard
              type={cardType}
              title="functions"
              img="Object10"
              link="/computing/function/new"
              description="An isolated environment created for a function to execute in
              response to an event and can run in two modes: on-demand or
              persistent."
              introductionButtonText="Create your function"
              information={{
                type: 'computing',
                data: programAggregatedStatus,
              }}
            />
            <EntityCard
              type={cardType}
              title="instance"
              img="Object11"
              link="/computing/instance/new"
              description="A virtual machine that runs on a Aleph.im's infrastructure
              and can be configured with CPUs, memory, storage, and networking"
              introductionButtonText="Create your instance"
              information={{
                type: 'computing',
                data: instanceAggregatedStatus,
              }}
            />
            <EntityCard
              type={cardType}
              isComingSoon
              title="confidential VM"
              img="Object9"
              link="#"
              description="A virtual machine running for an extended period with their
              memory, storage, and execution fully encrypted and isolated from
              the host."
              introductionButtonText="Create your confidential"
              information={{
                type: 'computing',
                data: {
                  running: 0,
                  paused: 0,
                  booting: 0,
                },
              }}
            />
          </div>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <SectionTitle number="2">
            Storage <Icon name="folders" color="main0" size="0.66em" />
          </SectionTitle>
          <div tw="flex mt-6">
            <div tw="flex flex-wrap gap-6 items-stretch">
              <EntityCard
                type={cardType}
                title="volumes"
                img="Object15"
                link="/storage"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. "
                titleTooltip="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at."
                introductionButtonText="Create your volume"
                information={{
                  type: 'storage',
                  data: {
                    storage: 0,
                  },
                }}
                subItems={volumesCardItems}
              />
              <EntityCard
                type={cardType}
                isComingSoon
                title="persistent storage"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. "
                introductionButtonText="Create your persistent storage"
                img="Object16"
                link="/storage"
                information={{
                  type: 'storage',
                  data: {
                    storage: 0,
                    amount: 0,
                  },
                }}
              />
            </div>
          </div>
        </section>
      </Container>
      <Container $variant="xl">
        <HoldTokenDisclaimer />
      </Container>
    </>
  )
}
