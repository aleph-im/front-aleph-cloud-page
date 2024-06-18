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
import { useFunctionDashboardPage } from '@/hooks/pages/computing/useFunctionDashboardPage'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import FunctionsTabContent from '../../dashboard/FunctionsTabContent'
import VolumesTabContent from '../../dashboard/VolumesTabContent'

export default function FunctionDashboardPage() {
  const { tabs, tabId, setTabId, programs, volumes } =
    useFunctionDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'program' ? (
          <>
            {!!programs.length && (
              <Container $variant="xl" tw="my-10">
                <FunctionsTabContent data={programs} />
              </Container>
            )}
            <NoisyContainer type="grain-1" tw="py-20">
              <Container $variant="xl">
                <CardWithSideImage
                  imageSrc="/img/dashboard/function.svg"
                  imageAlt="Function illustration"
                  cardBackgroundColor="bg-white"
                >
                  <div tw="flex flex-col gap-16">
                    <div>
                      <div className="tp-info text-main0">WHAT IS A...</div>
                      <TextGradient as="h2" type="h3">
                        Function
                      </TextGradient>
                      Basicly, serverless computing at your fingertips (Lambda).
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Cras rutrum dignissim elit, ut maximus justo congue at.
                      Nulla lobortis, ligula in tempus tincidunt, eros nulla
                      congue sapien, ac aliquet mi ante non elit. 
                    </div>
                    <div tw="mt-6 flex flex-wrap items-center justify-between gap-6">
                      <ButtonLink
                        variant="primary"
                        size="md"
                        href="/computing/function/new"
                      >
                        Create function
                      </ButtonLink>
                      <ExternalLinkButton href="https://docs.aleph.im/computing/#persistent-execution">
                        Learn more
                      </ExternalLinkButton>
                    </div>
                  </div>
                </CardWithSideImage>
              </Container>
            </NoisyContainer>
          </>
        ) : tabId === 'volume' ? (
          <>
            {!!volumes.length && (
              <Container $variant="xl" tw="my-10">
                <VolumesTabContent data={volumes} />
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
