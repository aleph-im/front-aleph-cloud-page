import React from 'react'
import { Tabs } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import { useStorageDashboardPage } from '@/components/pages/console/storage/StorageDashboardPage/hook'
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
      {total.amount !== 0 && (
        <Container $variant="xl" tw="my-10 flex flex-wrap gap-6 justify-center">
          <EntitySummaryCard
            items={[
              {
                title: 'Volumes',
                img: 'Object15',
                buttonUrl: '/storage/volume/new',
                information: {
                  type: 'storage',
                  data: total,
                },
              },
            ]}
          />
          <EntitySummaryCard
            items={[
              {
                information: {
                  title: 'Linked',
                  type: 'storage',
                  data: linked,
                },
              },
              {
                information: {
                  title: 'Unlinked',
                  type: 'storage',
                  data: unlinked,
                },
              },
            ]}
          />
        </Container>
      )}

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
              info="WHAT ARE..."
              title="Volumes"
              description="Create immutable volumes for secure and dependable data storage. Ideal for dependencies and other critical data, ensuring consistency and reliability across your applications"
              withButton={volumes.length === 0}
              buttonUrl="/storage/volume/new"
              buttonText="Create new volume"
              externalLinkUrl="https://docs.aleph.im/computing/volumes/immutable/"
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
