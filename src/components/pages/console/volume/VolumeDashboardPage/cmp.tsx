import React from 'react'
import { Tabs } from '@aleph-front/core'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useVolumeDashboardPage } from './hook'
import VolumesTabContent from '../VolumesTabContent'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import EntitySummaryCard from '@/components/common/EntitySummaryCard'

export default function VolumeDashboardPage() {
  const {
    tabs,
    tabId,
    setTabId,
    volumes,
    volumesAggregatedStorage: { total, linked, unlinked },
  } = useVolumeDashboardPage()

  return (
    <>
      <CenteredContainer $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </CenteredContainer>
      {total.amount !== 0 && (
        <CenteredContainer
          $variant="xl"
          tw="my-10 flex flex-wrap gap-6 justify-center"
        >
          <EntitySummaryCard
            items={[
              {
                title: 'Volumes',
                img: 'Object15',
                buttonUrl: '/console/storage/volume/new',
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
        </CenteredContainer>
      )}

      <div role="tabpanel">
        {tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <CenteredContainer $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} />
              </CenteredContainer>
            )}
            <DashboardCardWithSideImage
              imageSrc="/img/dashboard/volume.svg"
              imageAlt="Volume illustration"
              info="WHAT ARE..."
              title="Volumes"
              description="Create immutable volumes for secure and dependable data storage. Ideal for dependencies and other critical data, ensuring consistency and reliability across your applications"
              withButton={volumes.length === 0}
              buttonUrl="/console/storage/volume/new"
              buttonText="Create new volume"
              externalLinkUrl="https://docs.aleph.im/computing/volumes/immutable/"
            />
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
