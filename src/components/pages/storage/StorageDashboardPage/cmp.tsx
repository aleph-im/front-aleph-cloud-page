import React from 'react'
import { NoisyContainer, Tabs, TextGradient } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import CardWithSideImage from '@/components/common/CardWithSideImage'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ButtonLink from '@/components/common/ButtonLink'
import { useStorageDashboardPage } from '@/hooks/pages/storage/useStorageDashboardPage'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'

export default function StorageDashboardPage() {
  const { tabs, tabId, setTabId, volumes } = useStorageDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <Container $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} />
              </Container>
            )}
            <NoisyContainer type="grain-1" tw="py-20">
              <Container $variant="xl">
                <CardWithSideImage
                  imageSrc="/img/dashboard/volume.svg"
                  imageAlt="Volume illustration"
                  imagePosition="left"
                  cardBackgroundColor="bg-white"
                  reverseColumnsWhenStacked={false}
                >
                  <div>
                    <div className="tp-info text-main0">HOW DOES IT WORK?</div>
                    <TextGradient as="h2" type="h3">
                      Storage
                    </TextGradient>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Cras rutrum dignissim elit, ut maximus justo congue at.
                    Nulla lobortis, ligula in tempus tincidunt, eros nulla
                    congue sapien, ac aliquet mi ante non elit. 
                  </div>
                  <div tw="mt-6 flex items-center justify-between">
                    {!volumes.length && (
                      <ButtonLink
                        variant="primary"
                        size="md"
                        href="/storage/volume/new"
                      >
                        Create new volume
                      </ButtonLink>
                    )}
                    <ExternalLinkButton href="#">Learn more</ExternalLinkButton>
                  </div>
                </CardWithSideImage>
              </Container>
            </NoisyContainer>
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
