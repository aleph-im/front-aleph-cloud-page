import React from 'react'
import {
  CardWithSideImage,
  NoisyContainer,
  Tabs,
  TextGradient,
} from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ButtonLink from '@/components/common/ButtonLink'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import { useHostingWebsiteDashboardPage } from '@/hooks/pages/hosting/useHostingWebsiteDashboardPage'
import WebsitesTabContent from '../../dashboard/WebsitesTabContent'

const CardWithSideImageElement = ({
  info,
  title,
  description,
  imageSrc,
  imageAlt,
  buttonUrl,
  buttonText,
  externalLinkUrl,
}: {
  info: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  buttonUrl: string
  buttonText: string
  externalLinkUrl: string
}) => (
  <NoisyContainer type="grain-1" tw="py-20">
    <Container $variant="xl">
      <CardWithSideImage
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        cardBackgroundColor="bg-white"
      >
        <div tw="flex flex-col gap-16">
          <div>
            <div className="tp-info text-main0">{info}</div>
            <TextGradient as="h2" type="h3">
              {title}
            </TextGradient>
            {description}
          </div>
          <div tw="mt-6 flex flex-wrap items-center justify-between gap-6">
            <ButtonLink variant="primary" size="md" href={buttonUrl}>
              {buttonText}
            </ButtonLink>
            <ExternalLinkButton href={externalLinkUrl}>
              Learn more
            </ExternalLinkButton>
          </div>
        </div>
      </CardWithSideImage>
    </Container>
  </NoisyContainer>
)

export default function SettingsDashboardPage() {
  const { tabs, tabId, setTabId, websites } = useHostingWebsiteDashboardPage()

  return (
    <>
      {tabs.length ? (
        <Container $variant="xl" tw="my-10">
          <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
        </Container>
      ) : (
        <></>
      )}
      <div role="tabpanel">
        {tabId === 'website' ? (
          <>
            {!!websites.length && (
              <Container $variant="xl" tw="my-10">
                <WebsitesTabContent
                  data={websites.sort((a, b) => b.date.localeCompare(a.date))}
                />
              </Container>
            )}
            <CardWithSideImageElement
              imageSrc="/img/dashboard/web3hosting.svg"
              imageAlt="SSH Key illustration"
              info="HOW TO..."
              title="Create your Website!"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum dignissim elit, ut maximus justo congue at. Nulla lobortis, ligula in tempus tincidunt, eros nulla congue sapien, ac aliquet mi ante non elit."
              buttonUrl="/hosting/website/new"
              buttonText="Create your website"
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
