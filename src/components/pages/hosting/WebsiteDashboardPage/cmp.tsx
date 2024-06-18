import React, { memo } from 'react'
import { NoisyContainer, Tabs, TextGradient } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import CardWithSideImage from '@/components/common/CardWithSideImage'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ButtonLink from '@/components/common/ButtonLink'
import { useWebsiteDashboardPage } from '@/hooks/pages/hosting/useWebsiteDashboardPage'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import WebsitesTabContent from '../../dashboard/WebsitesTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'

function WebsiteDashboardPage() {
  const { tabs, tabId, setTabId, websites, domains } = useWebsiteDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'website' ? (
          <>
            {!!websites.length && (
              <Container $variant="xl" tw="my-10">
                <WebsitesTabContent data={websites} />
              </Container>
            )}
            <NoisyContainer type="grain-1" tw="py-20">
              <Container $variant="xl">
                <CardWithSideImage
                  imageSrc="/img/dashboard/website.svg"
                  imageAlt="Website ilustration"
                  imagePosition="left"
                  cardBackgroundColor="bg-white"
                  reverseColumnsWhenStacked={false}
                >
                  <div tw="h-[16rem]">
                    <div className="tp-info text-main0">HOW TO...</div>
                    <TextGradient as="h2" type="h3">
                      Create your Website!
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
                      href="/hosting/website/new"
                    >
                      Create your website
                    </ButtonLink>
                    <ExternalLinkButton href="https://docs.aleph.im/computing/#persistent-execution">
                      Learn more
                    </ExternalLinkButton>
                  </div>
                </CardWithSideImage>
              </Container>
            </NoisyContainer>
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

export default memo(WebsiteDashboardPage)
