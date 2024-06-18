import React from 'react'
import { NoisyContainer, Tabs, TextGradient } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import CardWithSideImage from '@/components/common/CardWithSideImage'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ButtonLink from '@/components/common/ButtonLink'
import { useInstanceDashboardPage } from '@/hooks/pages/computing/useInstanceDashboardPage'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import InstancesTabContent from '../../dashboard/InstancesTabContent'
import VolumesTabContent from '../../dashboard/VolumesTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'

export default function InstanceDashboardPage() {
  const { tabs, tabId, setTabId, instances, volumes, domains } =
    useInstanceDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'instance' ? (
          <>
            {!!instances.length && (
              <Container $variant="xl" tw="my-10">
                <InstancesTabContent data={instances} />
              </Container>
            )}
            <NoisyContainer type="grain-1" tw="py-20">
              <Container $variant="xl">
                <CardWithSideImage
                  imageSrc="/img/dashboard/instance.svg"
                  imageAlt="Instance ilustration"
                  imagePosition="left"
                  cardBackgroundColor="bg-white"
                  reverseColumnsWhenStacked={false}
                >
                  <div tw="h-[16rem]">
                    <div className="tp-info text-main0">WHAT IS AN...</div>
                    <TextGradient as="h2" type="h3">
                      Instance
                    </TextGradient>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Cras rutrum dignissim elit, ut maximus justo congue at.
                    Nulla lobortis, ligula in tempus tincidunt, eros nulla
                    congue sapien, ac aliquet mi ante non elit. 
                  </div>
                  <div tw="mt-6 flex items-center justify-between">
                    <ButtonLink
                      variant="primary"
                      size="md"
                      href="/computing/instance/new"
                    >
                      Create instance
                    </ButtonLink>
                    <ExternalLinkButton href="https://docs.aleph.im/computing/#persistent-execution">
                      Learn more
                    </ExternalLinkButton>
                  </div>
                </CardWithSideImage>
              </Container>
            </NoisyContainer>
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <Container $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} cta={false} />
              </Container>
            )}
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains.length && (
              <Container $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} cta={false} />
              </Container>
            )}
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
