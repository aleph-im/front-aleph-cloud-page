import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useStorageDashboardPage } from '@/hooks/pages/storage/useStorageDashboardPage'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import EntitySummaryCard from '@/components/common/EntitySummaryCard'

export default function StorageDashboardPage() {
  const {
    tabs,
    tabId,
    setTabId,
    volumes,
    volumesAggregatedStorage: { total, linked, unlinked },
  } = useStorageDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <Container $variant="xl" tw="my-10 flex flex-wrap gap-6 justify-center">
        <EntitySummaryCard
          size="md"
          items={[
            {
              title: 'Volumes',
              img: 'Object15',
              buttonUrl: '/storage/volume/new',
              information: {
                type: 'storage',
                data: {
                  storage: total.size,
                  amount: total.amount,
                },
              },
            },
          ]}
        />
        <EntitySummaryCard
          size="md"
          items={[
            {
              information: {
                title: 'Linked',
                type: 'storage',
                data: { storage: linked.size, amount: linked.amount },
              },
            },
            {
              information: {
                title: 'Unlinked',
                type: 'storage',
                data: { storage: unlinked.size, amount: unlinked.amount },
              },
            },
          ]}
        />
      </Container>
      <div role="tabpanel">
        {tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <Container $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} />
              </Container>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/volume.svg"
              imageAlt="Volume illustration"
              info="HOW DOES IT WORK?"
              title="Storage"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              withButton={volumes.length === 0}
              buttonUrl="/storage/volume/new"
              buttonText="Create new volume"
              externalLinkUrl="#"
            />
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
